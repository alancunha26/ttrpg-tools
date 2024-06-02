export function sleep(duration = 2000) {
  return new Promise(resolve => setTimeout(resolve, duration));
}

export function onKeypress() {
  process.stdin.setRawMode(true);
  return new Promise<void>(resolve =>
    process.stdin.once('data', () => {
      process.stdin.setRawMode(false);
      resolve();
    })
  );
}
