main();

async function main() {
  /*
   * GPIO-Buttonの処理を移植
   */
  var gpioAccess = await navigator.requestGPIOAccess();
  var ledPort = gpioAccess.ports.get(26); // LEDの付いているポート
  await ledPort.export("out");
  var switchPort = gpioAccess.ports.get(5); // タクトスイッチの付いているポート
  await switchPort.export("in");
  switchPort.onchange = function(val) {
    // スイッチはPullupで離すと1なので反転させる
    ledPort.write(val === 0 ? 1 : 0);
  };

  try {
    var temp = document.getElementById("temp");
    var gx = document.getElementById("gx");
    var gy = document.getElementById("gy");
    var gz = document.getElementById("gz");
    var rx = document.getElementById("rx");
    var ry = document.getElementById("ry");
    var rz = document.getElementById("rz");
    var i2cAccess = await navigator.requestI2CAccess();
    var port = i2cAccess.ports.get(1);
    var mpu6050 = new MPU6050(port, 0x68);
    await mpu6050.init();
    while (1) {
      var val = await mpu6050.readAll();
      // console.log('value:', value);
      temp.innerHTML = val.temperature;
      gx.innerHTML = val.gx;
      gy.innerHTML = val.gy;
      gz.innerHTML = val.gz;
      rx.innerHTML = val.rx;
      ry.innerHTML = val.ry;
      rz.innerHTML = val.rz;
      await sleep(1000);
    }
  } catch (error) {
    console.error("error", error);
  }
}
