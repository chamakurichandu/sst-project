import React, { Component } from 'react';
import * as THREE from "three";
//import Stats from "../../node_modules/three/examples/jsm/libs/stats.module";
import { Clock } from 'three';
import { CSS3DRenderer, CSS3DObject } from '../../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
import auditoriumConfig from '../assets/exports/auditoriumexportdata.json';

import px_11 from "../textures/render_px_11.jpg";
import nx_11 from "../textures/render_nx_11.jpg";
import py_11 from "../textures/render_py_11.jpg";
import ny_11 from "../textures/render_ny_11.jpg";
import pz_11 from "../textures/render_pz_11.jpg";
import nz_11 from "../textures/render_nz_11.jpg";

import px_12 from "../textures/render_px_12.jpg";
import nx_12 from "../textures/render_nx_12.jpg";
import py_12 from "../textures/render_py_12.jpg";
import ny_12 from "../textures/render_ny_12.jpg";
import pz_12 from "../textures/render_pz_12.jpg";
import nz_12 from "../textures/render_nz_12.jpg";

import px_13 from "../textures/render_px_13.jpg";
import nx_13 from "../textures/render_nx_13.jpg";
import py_13 from "../textures/render_py_13.jpg";
import ny_13 from "../textures/render_ny_13.jpg";
import pz_13 from "../textures/render_pz_13.jpg";
import nz_13 from "../textures/render_nz_13.jpg";

import px_14 from "../textures/render_px_14.jpg";
import nx_14 from "../textures/render_nx_14.jpg";
import py_14 from "../textures/render_py_14.jpg";
import ny_14 from "../textures/render_ny_14.jpg";
import pz_14 from "../textures/render_pz_14.jpg";
import nz_14 from "../textures/render_nz_14.jpg";

import px_15 from "../textures/render_px_15.jpg";
import nx_15 from "../textures/render_nx_15.jpg";
import py_15 from "../textures/render_py_15.jpg";
import ny_15 from "../textures/render_ny_15.jpg";
import pz_15 from "../textures/render_pz_15.jpg";
import nz_15 from "../textures/render_nz_15.jpg";

import px_18 from "../textures/render_px_18.jpg";
import nx_18 from "../textures/render_nx_18.jpg";
import py_18 from "../textures/render_py_18.jpg";
import ny_18 from "../textures/render_ny_18.jpg";
import pz_18 from "../textures/render_pz_18.jpg";
import nz_18 from "../textures/render_nz_18.jpg";

import px_19 from "../textures/render_px_19.jpg";
import nx_19 from "../textures/render_nx_19.jpg";
import py_19 from "../textures/render_py_19.jpg";
import ny_19 from "../textures/render_ny_19.jpg";
import pz_19 from "../textures/render_pz_19.jpg";
import nz_19 from "../textures/render_nz_19.jpg";

class Auditoriumcss3d extends Component {
    componentDidMount() {
        window.addEventListener('resize', this.handleWindowResize);

        this.el.addEventListener('mousedown', this.onPointerStart);
        this.el.addEventListener('mousemove', this.onPointerMove);
        this.el.addEventListener('mouseleave', this.onPointerUp);
        this.el.addEventListener('mouseup', this.onPointerUp);
        this.el.addEventListener('wheel', this.onDocumentMouseWheel);
        this.el.addEventListener('touchstart', this.onPointerStart);
        this.el.addEventListener('touchmove', this.onPointerMove);
        this.el.addEventListener('touchend', this.onPointerUp);

        this.counter = 0;

        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
    }
    componentWillUnmount() {


        // this.renderer.renderLists.dispose();

        this.el.removeEventListener('mousedown', this.onPointerStart);
        this.el.removeEventListener('mousemove', this.onPointerMove);
        this.el.removeEventListener('mouseup', this.onPointerUp);
        this.el.removeEventListener('mouseleave', this.onPointerUp);
        this.el.removeEventListener('wheel', this.onDocumentMouseWheel);
        this.el.removeEventListener('touchstart', this.onPointerStart);
        this.el.removeEventListener('touchmove', this.onPointerMove);
        this.el.removeEventListener('touchend', this.onPointerUp);

        window.removeEventListener('resize', this.handleWindowResize);

        window.cancelAnimationFrame(this.requestID);
        // this.controls.dispose();
    }
    handleWindowResize = () => {
        const width = window.innerWidth;//this.el.clientWidth;
        const height = window.innerHeight;// this.el.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };
    onPointerStart = (event) => {
        this.isUserInteracting = true;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;

        this.onMouseDownLon = this.lon;
        this.onMouseDownLat = this.lat;
    };

    onPointerMove = (event) => {
        //this.counter += 1;
        //console.log("onPointerMove: " + this.counter);

        event.preventDefault(); // prevent scrolling
        event.stopPropagation();

        if (this.isUserInteracting === true) {

            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;

            this.lon = (this.onMouseDownMouseX - clientX) * 0.2 + this.onMouseDownLon;
            this.lat = (clientY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat;
        }
    };

    onPointerUp = () => {
        this.isUserInteracting = false;
    };

    onDocumentMouseWheel = (event) => {
        // var fov = this.camera.fov + event.deltaY * 0.05;
        // this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        // this.camera.updateProjectionMatrix();
    };

    moveToHotSpotAtIndex = (index) => {

        if (index >= auditoriumConfig["Items"].length)
            return;

        if (this.hotspotsDict[index] === null) {
            console.log("its null so reurning");
            return;
        }
        this.currentIndex = index;
        this.setState({ loading: true });

        this.loadHotspot(index);
    };

    actualMoveToNewHotSpot = () => {
        // console.log(disables[this.currentIndex.toString()]);

        const hotspotConf = auditoriumConfig["Items"][this.currentIndex];

        this.camera.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        this.dummySphere.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);



        // this.mesh.material = this.material;
        // this.material = null;
        // const hotspotConf = exhibitionConfig["Items"][this.currentIndex];
        // this.camera.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        // this.mesh.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        // this.dummySphere.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);

        // Hide Hotspots
        // for (let i = 0; i < this.hotSpots.length; ++i) {
        //     this.hotSpots[i].visible = true;
        // }
        // var toDisable = disables[this.currentIndex.toString()];
        // for (let i = 0; i < toDisable.length; ++i) {
        //     this.hotSpots[toDisable[i]].visible = false;
        // }
    };
    update = () => {
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime += this.deltaTime;
        this.changeBackgroundTime += this.deltaTime;

        if (this.changeBackgroundTime >= 5.0) {
            this.changeBackgroundTime = 0;
            this.lastIndex += 1;
            // this.loadHotspot(this.lastIndex);
        }

        // if (this.isUserInteracting === false) {
        //     this.lon += 0.2;
        // }

        this.lat = Math.max(- 85.0, Math.min(85.0, this.lat));
        this.phi = THREE.MathUtils.degToRad(90.0 - this.lat);
        this.theta = THREE.MathUtils.degToRad(180.0 - this.lon);

        // this.camera.target.x = 500 * Math.sin(this.phi) * Math.cos(this.theta);
        // this.camera.target.y = 500 * Math.cos(this.phi);
        // this.camera.target.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        // this.camera.lookAt(this.camera.target);

        this.newTargetPos.x = 500 * Math.sin(this.phi) * Math.cos(this.theta) * -1;
        this.newTargetPos.y = 500 * Math.cos(this.phi) * -1;
        this.newTargetPos.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
        this.dummySphere.lookAt(this.newTargetPos);
        this.camera.quaternion.slerp(this.dummySphere.quaternion, 0.2);

        // this.stats.update();
    };

    Element = (id, x, y, z, ry) => {
        var div = document.createElement('div');
        div.style.width = '320px';
        div.style.height = '190px';
        div.style.backgroundColor = '#000';

        var iframe = document.createElement('iframe');
        iframe.style.width = '320px';
        iframe.style.height = '190px';
        iframe.style.border = '0px';
        // iframe.src = ['https://www.youtube.com/embed/', id, '?rel=0'].join('');
        iframe.src = 'https://player.vimeo.com/video/465515407';
        div.appendChild(iframe);

        // <iframe src="https://player.vimeo.com/video/465515407" width="640" height="360" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>

        var object = new CSS3DObject(div);
        object.position.set(x, y, z);
        object.rotation.y = ry;

        return object;
    };

    GetCSS3HotSpot = (px, nx, py, ny, pz, nz, x, y, z) => {
        var sides = [
            { url: px, position: [- 1012 + x, 0, 0 + z], rotation: [0, Math.PI / 2, 0] },
            { url: nx, position: [1012 + x, 0, 0 + z], rotation: [0, - Math.PI / 2, 0] },
            { url: py, position: [0 + x, 1012, 0 + z], rotation: [Math.PI / 2, 0, Math.PI] },
            { url: ny, position: [0 + x, -1012, 0 + z], rotation: [- Math.PI / 2, 0, Math.PI] },
            { url: pz, position: [0 + x, 0, 1012 + z], rotation: [0, Math.PI, 0] },
            { url: nz, position: [0 + x, 0, -1012 + z], rotation: [0, 0, 0] }
        ];

        return { "sides": sides, "position": [x, y, z] };
    };

    sceneSetup = () => {
        this.clock = new Clock();
        this.clock.getDelta();
        this.elapsedTime = 0;
        this.deltaTime = 0;
        this.changeBackgroundTime = 0;
        this.lastIndex = 0;

        this.loader = new THREE.TextureLoader();

        // get container dimensions and use them for scene sizing
        const width = window.innerWidth;//this.el.clientWidth;
        const height = window.innerHeight;// this.el.clientHeight;

        this.hotspotsDict = {
        };

        this.isUserInteracting = false;
        this.onMouseDownMouseX = 0;
        this.onMouseDownMouseY = 0;
        this.lon = 0;
        this.onMouseDownLon = 0;
        this.lat = 0;
        this.onMouseDownLat = 0;
        this.phi = 0;
        this.theta = 0;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );

        {
            const hotspotConf = auditoriumConfig["Items"][0];
            this.hotspotsDict[11] = this.GetCSS3HotSpot(px_11, nx_11, py_11, ny_11, pz_11, nz_11, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][1];
            this.hotspotsDict[12] = this.GetCSS3HotSpot(px_12, nx_12, py_12, ny_12, pz_12, nz_12, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][2];
            this.hotspotsDict[13] = this.GetCSS3HotSpot(px_13, nx_13, py_13, ny_13, pz_13, nz_13, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][3];
            this.hotspotsDict[14] = this.GetCSS3HotSpot(px_14, nx_14, py_14, ny_14, pz_14, nz_14, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][4];
            this.hotspotsDict[15] = this.GetCSS3HotSpot(px_15, nx_15, py_15, ny_15, pz_15, nz_15, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][5];
            this.hotspotsDict[16] = this.GetCSS3HotSpot("", "", "", "", "", "", hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][6];
            this.hotspotsDict[17] = this.GetCSS3HotSpot("", "", "", "", "", "", hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][7];
            this.hotspotsDict[18] = this.GetCSS3HotSpot(px_18, nx_18, py_18, ny_18, pz_18, nz_18, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }
        {
            const hotspotConf = auditoriumConfig["Items"][8];
            this.hotspotsDict[19] = this.GetCSS3HotSpot(px_19, nx_19, py_19, ny_19, pz_19, nz_19, hotspotConf.x, hotspotConf.y + hotspotConf.height, hotspotConf.z * -1)
        }

        for (var i = 0; i < this.hotspotsDict[11].sides.length; i++) {
            var side = this.hotspotsDict[11].sides[i];

            var element = document.createElement('img');
            element.draggable = false;
            element.width = 2026; // 2 pixels extra to close the gap.
            element.src = side.url;

            var object = new CSS3DObject(element);
            object.position.fromArray(side.position);
            object.rotation.fromArray(side.rotation);
            this.scene.add(object);
        }

        this.camera.position.set(this.hotspotsDict[11].position[0], 0, this.hotspotsDict[11].position[2]);

        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.newTargetPos = new THREE.Vector3(0, 0, 0);

        var geometry = new THREE.SphereGeometry(5, 32, 32);
        var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.dummySphere = new THREE.Mesh(geometry, material);
        this.scene.add(this.dummySphere);

        this.renderer = new CSS3DRenderer({ antialias: true });


        // this.stats = new Stats();
        // this.stats.setMode(0);
        // this.stats.domElement.style.position = 'absolute';
        // this.stats.domElement.style.left = '0';
        // this.stats.domElement.style.top = '0';
        // document.body.appendChild(this.stats.domElement);

        var group = new THREE.Group();
        // group.add(this.Element('XnKbj5kl1kU', 0, 0, 240, 0));
        // group.add(this.Element('Y2-xZ-1HE-Q', 240, 0, 0, Math.PI / 2));
        // group.add(this.Element('IrydklNpcFI', 0, 0, - 240, Math.PI));
        group.add(this.Element('IrydklNpcFI', this.hotspotsDict[11].position[0] - 940, -60, -210, Math.PI / 2));
        this.scene.add(group);

        this.renderer.setSize(width, height);
        this.el.appendChild(this.renderer.domElement); // mount using React ref

        // this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        // this.controls.minDistance = 500;
        // this.controls.maxDistance = 6000;
        // this.controls.addEventListener('change', this.renderScene);
    };
    addCustomSceneObjects = () => {
        const lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 200, 0);
        lights[1].position.set(100, 200, 100);
        lights[2].position.set(- 100, - 200, - 100);

        this.scene.add(lights[0]);
        this.scene.add(lights[1]);
        this.scene.add(lights[2]);
    };
    startAnimationLoop = () => {
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        // this.controls.update();
        this.update();
        this.renderer.render(this.scene, this.camera);
        this.requestID = window.requestAnimationFrame(this.startAnimationLoop);
    };

    loadHotspot = (index) => {
        //console.log("loadHotspot : index: " + index);

        if (this.hotspotsDict[index] != null) {
            //console.log("loadHotspot : loading 1");

            this.loader.load(this.hotspotsDict[index],
                (texture) => {
                    // console.log("loadHotspot : loading 2");
                    this.mesh.material.dispose();
                    texture.anisotropy = this.renderer.capabilities.getMaxAnisotropy();
                    var material = new THREE.MeshBasicMaterial({ map: texture });
                    material.map.minFilter = THREE.LinearFilter;
                    this.mesh.material = material
                },
                // onProgress callback currently not supported
                undefined,
                // onError callback
                function (err) {
                    console.error('An error happened.');
                }
            );
        }
        else {
            console.log("Cannot load null paths Skipping it");
        }
    };

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (<div>
            <div ref={ref => (this.el = ref)} />
        </div>
        );
    }
};

export default Auditoriumcss3d;  