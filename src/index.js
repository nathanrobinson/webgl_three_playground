//import {Renderer} from './renderer.js';
import {ThreeDee} from './threedee.js';

//var renderer = new Renderer();
//document.body.appendChild(renderer.canvas);
//renderer.run();

var threed = new ThreeDee();
document.body.appendChild( threed.renderer.domElement );
threed.animate();