let plugins = [];
try {
  // prefer the package name, but allow tests to run even if plugin resolution fails
  const tailwindPlugin = await import('@tailwindcss/postcss').then(m => m.default || m).catch(() => null);
  if (tailwindPlugin) plugins.push(tailwindPlugin);
} catch (e) {
  // ignore - tests may run without PostCSS
}

export default { plugins };
