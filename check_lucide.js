async function printLucideExports() {
  const lucide = await import('lucide-react');
  console.log(Object.keys(lucide).slice(0, 20));
}

printLucideExports().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
