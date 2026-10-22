import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { AnalyticsSession, AnalyticsEvent } from '@/models/Analytics';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { visitorId, path = '/', device = 'desktop', isStandalone = false, action = 'visit', platform = 'web' } = body;

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId is required' }, { status: 400 });
    }

    // 1. App install tracking
    if (action === 'install') {
      await AnalyticsEvent.create({
        type: 'app_install',
        visitorId,
        platform,
      });

      await AnalyticsSession.updateMany(
        { visitorId },
        { $set: { installedApp: true, installedAt: new Date() } }
      );

      return NextResponse.json({ success: true, tracked: 'install' });
    }

    // 2. Visit & Heartbeat tracking
    const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
    const existingSession = await AnalyticsSession.findOne({
      visitorId,
      lastActive: { $gte: thirtyMinsAgo },
    }).sort({ lastActive: -1 });

    if (existingSession) {
      existingSession.lastActive = new Date();
      existingSession.path = path;
      existingSession.device = device;
      existingSession.isStandalone = !!isStandalone;
      if (isStandalone) {
        existingSession.installedApp = true;
      }
      await existingSession.save();
    } else {
      await AnalyticsSession.create({
        visitorId,
        path,
        device,
        isStandalone: !!isStandalone,
        installedApp: !!isStandalone,
        lastActive: new Date(),
      });
    }

    return NextResponse.json({ success: true, active: true });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectToDatabase();

    const threeMinsAgo = new Date(Date.now() - 3 * 60 * 1000);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      currentlyVisiting,
      totalAppInstalls,
      totalVisitsToday,
      totalVisitsAllTime,
      mobileVisits,
      desktopVisits,
      recentVisitors,
    ] = await Promise.all([
      // Live active in last 3 mins
      AnalyticsSession.countDocuments({ lastActive: { $gte: threeMinsAgo } }),
      // Total installs (explicit install events + standalone session detections)
      AnalyticsEvent.countDocuments({ type: 'app_install' }),
      // Visits started today
      AnalyticsSession.countDocuments({ createdAt: { $gte: startOfToday } }),
      // Total visits all-time
      AnalyticsSession.countDocuments(),
      // Device breakdown
      AnalyticsSession.countDocuments({ device: 'mobile' }),
      AnalyticsSession.countDocuments({ device: 'desktop' }),
      // Latest 10 active sessions
      AnalyticsSession.find()
        .sort({ lastActive: -1 })
        .limit(10)
        .lean(),
    ]);

    // Distinct visitors who installed the app or run in standalone mode
    const standaloneCount = await AnalyticsSession.countDocuments({
      $or: [{ installedApp: true }, { isStandalone: true }],
    });

    const finalInstallCount = Math.max(totalAppInstalls, standaloneCount);

    return NextResponse.json({
      currentlyVisiting: Math.max(currentlyVisiting, 1), // At least 1 (the current viewing admin)
      totalAppInstalls: finalInstallCount,
      totalVisitsToday,
      totalVisitsAllTime,
      mobileVisits,
      desktopVisits,
      recentVisitors: JSON.parse(JSON.stringify(recentVisitors)),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
