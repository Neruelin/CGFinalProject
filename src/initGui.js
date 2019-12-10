function markerFolder(gui, guiObject) {
  gui.addFolder("Marker")
    .add(guiObject, "placeMarkers")
    .add(guiObject, "clearMarkers");
}

function metricsFolder(gui, guiObject) {
  gui.addFolder("Telemetry")
    .add(guiObject, "ShowFullTelemetry");
}

function lockonFolder (gui, guiObject, setLockon) {
  gui.addFolder("Lock On")
    .add(guiObject, "target").onChange(setLockon).name("Target")
    .add(guiObject, "lockonDistance", 0.001, 25.0, 0.001).name("Zoom")
    .add(guiObject, "unlock").name("Unlock");
}

function timeFolder (gui, guiObject, setChecked) {
  let timeFolder = gui.addFolder("Time Controls");
  timeFolder.add(guiObject.timeScales, 'stopped').name('Stopped')
    .listen().onChange(function(){
      setChecked("stopped", guiObject.timeScales);
      timeScale = 0;
    });

  timeFolder.add(guiObject.timeScales, 'real').name('Real Time')
    .listen().onChange(function(){
      setChecked("real", guiObject.timeScales);
      timeScale = 1;
    });

  timeFolder.add(guiObject.timeScales, 'hundred').name('x100')
    .listen().onChange(function(){
      setChecked("hundred", guiObject.timeScales);
      timeScale = 100;
    });

  timeFolder.add(guiObject.timeScales, 'thousand').name('x1000')
    .listen().onChange(function(){
      setChecked("thousand", guiObject.timeScales);
      timeScale = 1000;
    });
  
  timeFolder.add(guiObject.timeScales, 'tenThousand').name('x10000')
    .listen().onChange(function(){
      setChecked("tenThousand", guiObject.timeScales);
      timeScale = 10000;
    });
}


function scaleFolder () {
  
}

export default function (gui, guiObject) {
  markerFolder();
  metricsFolder();
  lockonFolder();
  timeFolder();
  scaleFolder();
  graphicalOptionsFolder();



  let scaleFolder = gui.addFolder("Size Controls");
  scaleFolder.add(guiObject.sizeScales, "scaledup").name("Scaled up")
    .listen().onChange(function() {
      setChecked("scaledup", guiObject.sizeScales);
      let obj;
      for (obj of (objects)) {
        if(obj.name == "Sun")
          obj.scale.set(0.075, 0.075, 0.075);
        else
          obj.scale.set(1.0, 1.0, 1.0);
      }
    });

    scaleFolder.add(guiObject.sizeScales, "actualSize").name("Actual size")
    .listen().onChange(function() {
      setChecked("actualSize", guiObject.sizeScales);
      let obj;
      for (obj of (objects)) {
        obj.scale.set(0.001, 0.001, 0.001);
      }
    });

  function setChecked( prop, list ){
    for (let param in list){
      list[param] = false;
    }
    list[prop] = true;
  }

  let graphicalOptions = gui.addFolder("Graphical Options");
  graphicalOptions.add(guiObject, "coldSun").name("Ultraviolet Sun")
    .listen().onChange(function(flag) {
      let obj;
      for (obj of objects) {
        if (obj.name == "Sun")
        {
          if (flag) {
            sunLight.children[0].visible = false;
            obj.visible = true;
          } else {
            sunLight.children[0].visible = true;
            obj.visible = false;
          }
        }
      }
    });

  graphicalOptions.add(guiObject, "showOrbits").name("Show orbits")
    .listen().onChange(function(flag) {
      let obj;
      for (obj of orbits) {
        if (flag)
          obj.visible = true;
         else
          obj.visible = false;
      }
    });
}