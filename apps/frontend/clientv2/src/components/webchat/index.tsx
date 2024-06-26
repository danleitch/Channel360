import Script from 'next/script';

const WebchatScript = () => (
  <>
    <Script id="smooch-script" strategy="lazyOnload">
      {`
          !function(o,p,s,e,c){
            var i,a,h,u=[],d=[];function t(){var t="You must provide a supported major version.";try{if(!c)throw new Error(t);var e,n="https://cdn.smooch.io/",r="smooch";if((e="string"==typeof this.response?JSON.parse(this.response):this.response).url){var o=p.getElementsByTagName("script")[0],s=p.createElement("script");s.async=!0;var i=c.match(/([0-9]+).?([0-9]+)?.?([0-9]+)?/),a=i&&i[1];if(i&&i[3])s.src=n+r+"."+c+".min.js";else{if(!(4<=a&&e["v"+a]))throw new Error(t);s.src=e["v"+a]}o.parentNode.insertBefore(s,o)}}catch(e){e.message===t&&console.error(e)}}o[s]={init:function(){i=arguments;var t={then:function(e){return d.push({type:"t",next:e}),t},catch:function(e){return d.push({type:"c",next:e}),t}};return t},on:function(){u.push(arguments)},render:function(){a=arguments},destroy:function(){h=arguments}},o.__onWebMessengerHostReady__=function(e){if(delete o.__onWebMessengerHostReady__,o[s]=e,i)for(var t=e.init.apply(e,i),n=0;n<d.length;n++){var r=d[n];t="t"===r.type?t.then(r.next):t.catch(r.next)}a&&e.render.apply(e,a),h&&e.destroy.apply(e,h);for(n=0;n<u.length;n++)e.on.apply(e,u[n])};var n=new XMLHttpRequest;n.addEventListener("load",t),n.open("GET","https://"+e+".webloader.smooch.io/",!0),n.responseType="json",n.send()
          }(window,document,"Smooch","6523ce4ff5d0437f69df8e13","5");
        `}
    </Script>
    <Script id="smooch-init" strategy="lazyOnload">
      {`
          Smooch.init({ integrationId: '6523ce4ff5d0437f69df8e13' });
        `}
    </Script>
  </>
);

export default WebchatScript;
