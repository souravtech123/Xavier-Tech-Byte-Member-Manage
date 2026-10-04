import sys

with open('lib/actions.ts', 'r') as f:
    content = f.read()

old_save = """async function saveFile(file: File | null): Promise<string | undefined> {
  if (!file || typeof file === 'string' || file.size === 0) return undefined;
  try {"""

new_save = """async function saveFile(file: File | null): Promise<string | undefined> {
  if (!file || typeof file === 'string' || file.size === 0) return undefined;
  if (file.size > 5 * 1024 * 1024) {
    throw new Error(`File ${file.name} exceeds the 5MB size limit.`);
  }
  try {"""

content = content.replace(old_save, new_save)

with open('lib/actions.ts', 'w') as f:
    f.write(content)
