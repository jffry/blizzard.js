(function (win, doc)
{

  //create the element
  var canvas = doc.createElement('canvas');

  var style = canvas.style;
  style.position = 'fixed';
  style.top =  style.left =  0;
  style.pointerEvents = 'none';
  style.zIndex = 9e9;

  canvas.width = win.innerWidth;
  canvas.height = win.innerHeight;
  doc.body.appendChild(canvas);

  //state vars
  var ctx = canvas.getContext('2d');
  var w = canvas.width;
  var h = canvas.height;
  var windScale = 1;
  var windBias = 0.5;
  var flakes = [];
  var numFlakes = 100;
  for (var i = 0; i < numFlakes; i++)
  {
    var f = randomizeFlake({});
    f.y = -h * Math.random();
    flakes.push(f);
  }
  //start rendering!
  loop();

  //render loop
  function loop()
  {
    update();
    draw();
    win.requestAnimationFrame(loop);
  };

  function randomizeFlake(flake)
  {
    var MIN_R = 0.1, MAX_R = 2;
    var MIN_VX = -windScale;
    var MAX_VX = +windScale;
    var MIN_VY = 0.2 * windScale;
    var MAX_VY = 2.5 * windScale;
    var MIN_BRIGHT = 200, MAX_BRIGHT = 255;
    var zfrac = Math.random();
    var bright = Math.round(MIN_BRIGHT + zfrac * (MAX_BRIGHT - MIN_BRIGHT));
    var flake = flake || {};
    flake.x = Math.random() * w;
    flake.y = 0;
    flake.vx = zfrac * (MIN_VX + Math.random() * (MAX_VX - MIN_VX));
    flake.vy = MIN_VY + zfrac * (MAX_VY - MIN_VY);
    flake.r = MIN_R + zfrac * (MAX_R - MIN_R);
    flake.rgb = 'rgb(' + bright + ',' + bright + ',' + bright + ')';
    return flake;
  }

  function update()
  {
    for (var i = 0; i < numFlakes; i++)
    {
      var flake = flakes[i];
      flake.x += flake.vx + (windBias * windScale);
      flake.y += flake.vy;
      while (flake.x < 0) flake.x += w;
      while (flake.x > w) flake.x -= w;
      while (flake.y > h)
      {
        //flake.y -= h;
        randomizeFlake(flakes[i]);
      }
    }
  }

  function draw()
  {
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = null;
    for (var i = 0; i < numFlakes; i++)
    {
      var flake = flakes[i];
      ctx.fillStyle = flake.rgb;
      ctx.beginPath();
      ctx.arc(flake.x, flake.y, flake.r, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

})(window, document);
