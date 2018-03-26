import * as THREE from 'three';

export class ThreeDee {
    constructor() {
        this.height = window.innerHeight - 15;
        this.width = window.innerWidth - 15;
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.mesh = null;
        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 0.001, 10 );
        this.scene = new THREE.Scene();
        this.init();
    }

    loadTexture(href){
        var texture = new THREE.TextureLoader().load( href );
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set( 1, 1 );
        return texture;
    }

    init() {
        this.camera.position.z = 1;
        
        const ambientLight = new THREE.AmbientLight( 0x505040 ); // soft white light
        this.scene.add( ambientLight );

        this.pointLight = new THREE.PointLight( 0x5f5f4a , 1, 0, 2);
        this.pointLight.position.set( 10, 10, 10 );
        this.scene.add( this.pointLight );

        const surfaceTexture = this.loadTexture( "./images/surface.jpg" );
        const emissiveTexture = this.loadTexture( "./images/emissive.jpg" );
        //const lightTexture = this.loadTexture( "./images/light.jpg" );
        //const bumpTexture = this.loadTexture( "./images/bump.jpg" );
          
        const geometry = new THREE.SphereGeometry(0.2, 100, 100);//.BoxGeometry( 0.2, 0.2, 0.2 );
        const material = new THREE.MeshStandardMaterial({
            /** geometry color in hexadecimal. Default is 0xffffff. */
            //color: 0xABCDEF,
            //specular: 0xFEDCBA,
            //shininess: 1,
            //opacity: 0.5,
            map: surfaceTexture,
            lightMap: surfaceTexture,
            //emissive: 0xFEDCBA,
            //emissiveIntensity: 0.5,
            //emissiveMap: emissiveTexture,
            //bumpMap: bumpTexture
        });
     
        this.mesh = new THREE.Mesh( geometry, material );
        this.scene.add( this.mesh );
        
        const geometry2 = new THREE.SphereGeometry(0.05, 100, 100);//.BoxGeometry( 0.2, 0.2, 0.2 );        
        const material2 = new THREE.MeshStandardMaterial({
            /** geometry color in hexadecimal. Default is 0xffffff. */
            //color: 0xABCDEF,
            //specular: 0xFEDCBA,
            //shininess: 1,
            //opacity: 0.5,
            map: emissiveTexture,
            lightMap: emissiveTexture,
            //emissive: 0xFEDCBA,
            //emissiveIntensity: 0.5,
            //emissiveMap: emissiveTexture,
            //bumpMap: bumpTexture
        });
     
        this.mesh2 = new THREE.Mesh( geometry2, material2 );
        this.mesh2.position.setX(0.5);
        this.scene.add( this.mesh2 );
     
        this.renderer.setSize( this.width, this.height );
        //document.body.appendChild( renderer.domElement );
     
    }
     
    animate() {
        requestAnimationFrame(() => this.animate());

        const time = new Date().getTime() / 1000;

        //this.pointLight.position.setY(Math.sin(time) * 7.5);
     
        //this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.022;
        this.mesh2.rotation.y += 0.02;
        this.mesh2.position.setZ(Math.sin(time) * 0.5);
        this.mesh2.position.setX(-Math.cos(time));
        this.mesh2.position.setY(Math.cos(time) * 0.01);
     
        this.renderer.render( this.scene, this.camera );
     
    }
}