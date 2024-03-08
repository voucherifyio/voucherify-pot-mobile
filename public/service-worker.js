const installEvent = () => {
    self.addEventListener('install', () => {
      console.log('service worker installed');
    });
  };
  installEvent();

  const activateEvent = () => {
    self.addEventListener('activate', (e) => {
        console.log(e)
      console.log('service worker activated');
    });
  };
  activateEvent();
