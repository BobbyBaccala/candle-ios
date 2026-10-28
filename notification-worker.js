/* HTTPS web-push receiver infrastructure. A server/VAPID subscription service
   must be deployed before enabling browser reminders; no fake browser timer. */
self.addEventListener('push',event=>{
 let payload;try{payload=event.data.json()}catch{return}
 if(payload?.type!=='streak-reminder'||!/^\d{4}-\d{2}-\d{2}$/.test(payload.localDay||''))return;
 const expires=Date.parse(payload.expires);if(!Number.isFinite(expires)||expires<=Date.now())return;
 event.waitUntil(self.registration.showNotification('Keep your Candle streak glowing',{
  body:'One lesson before midnight keeps your personal streak going. Pick any topic.',
  tag:'candle-streak-'+payload.localDay,data:{destination:'learn'},renotify:false
 }));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const url=new URL('./index.html?open=learn',self.registration.scope).href;
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async windows=>{
  for(const win of windows)if(new URL(win.url).origin===self.location.origin){await win.navigate(url);return win.focus()}
  return self.clients.openWindow(url);
 }));
});
