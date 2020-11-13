import React, { Component } from 'react';
import * as THREE from "three";
//import Stats from "../../node_modules/three/examples/jsm/libs/stats.module";
import sphereimage0 from "../textures/360render_0.jpeg";
import sphereimage1 from "../textures/360render_1.jpeg";
import sphereimage2 from "../textures/360render_2.jpeg";
import sphereimage3 from "../textures/360render_3.jpeg";
import sphereimage4 from "../textures/360render_4.jpeg";
import sphereimage5 from "../textures/360render_5.jpeg";
import sphereimage6 from "../textures/360render_6.jpeg";
import sphereimage7 from "../textures/360render_7.jpeg";
import sphereimage8 from "../textures/360render_8.jpeg";
import sphereimage9 from "../textures/360render_9.jpeg";
import sphereimage10 from "../textures/360render_10.jpeg";
import sphereimage11 from "../textures/360render_11.jpeg";
import sphereimage12 from "../textures/360render_12.jpeg";
import sphereimage13 from "../textures/360render_13.jpeg";
import sphereimage14 from "../textures/360render_14.jpeg";
import sphereimage15 from "../textures/360render_15.jpeg";
import sphereimage16 from "../textures/360render_16.jpeg";
import sphereimage17 from "../textures/360render_17.jpeg";
import sphereimage18 from "../textures/360render_18.jpeg";
import sphereimage19 from "../textures/360render_19.jpeg";
import { Clock, Vector3, MathUtils } from 'three';
import disables from "../assets/exports/disables.json";
import exhibitionConfig from '../assets/exports/exhibitionexportdata.json';
import modelsConfig from '../assets/exports/modelsexportdata.json';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import backgroundMusic from "../sounds/backgroundMusic.mp3";
import { FBXLoader } from '../../node_modules/three/examples/jsm/loaders/FBXLoader.js';
// import model3d_0 from '../models/Coir2.fbx';
import model3d_0 from '../models/Subsea_Drilling_platform.fbx';

import VimeoPlayer from './vimeoPlayer';
import PdfViewer from './pdfViewer';
import FeedbackForm from './feedbackForm';
import ConfirmationDialog from './confirmationDialog';
import videoCallImage from "../assets/svg/ss/video-call.svg";
import button1Image from '../assets/Images/button1.png';
import pdfViewerButtonImage from '../assets/Images/button2.png';
import videoPlayerButtonImage from '../assets/Images/button3.png';

// import './threex.chromakey';

class Game extends Component {
    state = {
        loading: false,
        showVideoCallPermissionDialog: false,
        showPDFViewer: false,
        showVideoPlayer: false,
    };
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
        this.currentIndex = 0;
        this.material = null;

        this.hotSpotGeometry = new THREE.CylinderGeometry(0.6, 0.6, 0.6, 32);
        this.hotSpotPresenterGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.1, 32);
        this.hotSpotMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.hotSpots = [];

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.mouseDownPos = new THREE.Vector2();
        this.mouseUpPos = new THREE.Vector2();

        let searchStr = this.props.location.search;
        let stall_id = 50;
        if (searchStr.length > 0) {
            let newString = searchStr.replace('?', '');
            let res = newString.split("&");
            for (let i = 0; i < res.length; ++i) {
                let indres = newString.split("=");
                if (indres.length === 2 && indres[0] === "stall_id") {
                    stall_id = parseInt(indres[1]);
                }
            }
        }

        this.currentIndex = (stall_id - 50) % 5;

        this.sceneSetup();
        this.addCustomSceneObjects();
        this.startAnimationLoop();
    }

    componentWillUnmount() {
        console.log("componentWillUnmount");

        this.hotSpotGeometry.dispose();
        this.hotSpotPresenterGeometry.dispose();
        this.hotSpotMat.dispose();

        for (let i = 0; i < this.hotSpots.length; ++i) {
            this.scene.remove(this.hotSpots[i]);
        }

        this.hotSpots = [];

        if (this.sound.isPlaying)
            this.sound.stop();
        this.sound = null;

        this.video.pause();
        this.videoTexture.dispose();

        this.renderer.renderLists.dispose();

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
    }
    handleWindowResize = () => {
        const width = window.innerWidth;//this.el.clientWidth;
        const height = window.innerHeight;// this.el.clientHeight;

        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    };
    onPointerStart = (event) => {
        event.preventDefault();

        if (this.state.loading) {
            return;
        }

        this.isUserInteracting = true;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;

        this.mouseDownPos.x = clientX;
        this.mouseDownPos.y = clientY;
        this.mouseMovePosX = clientX;
        this.mouseMovePosY = clientY;

        this.rotateType = 0;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            if (intersects[0].object.name === "3DModel") {
                this.rotateType = 1;
                this.currentModel = intersects[0].object;
            }
            else if (intersects[0].object.name === "VideoChat") {
                console.log("VideoChat");
                this.setState({ showVideoCallPermissionDialog: true });
            }
            else if (intersects[0].object.name === "PDFViewer") {
                console.log("PDFViewer");
                this.setState({ showPDFViewer: true });
            }
            else if (intersects[0].object.name === "VideoViewer") {
                console.log("VideoViewer");
                this.setState({ showVideoPlayer: true });
            }
        }

        if (this.rotateType === 0) {
            this.onMouseDownLon = this.lon;
            this.onMouseDownLat = this.lat;
        }
        else if (this.rotateType === 1) {
            this.onMouseDownLon1 = this.lon1;
            this.onMouseDownLat1 = this.lat1;
        }

    };

    onPointerMove = (event) => {
        event.preventDefault(); // prevent scrolling
        event.stopPropagation();

        if (this.state.loading) {
            return;
        }

        if (this.isUserInteracting === true) {

            this.mouseMovePosX = event.clientX || event.touches[0].clientX;
            this.mouseMovePosY = event.clientY || event.touches[0].clientY;

            if (this.rotateType === 0) {
                this.lon = (this.onMouseDownMouseX - this.mouseMovePosX) * 0.2 + this.onMouseDownLon;
                this.lat = (this.mouseMovePosY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat;
            }
            else if (this.rotateType === 1) {
                this.lon1 = (this.onMouseDownMouseX - this.mouseMovePosX) * 0.2 + this.onMouseDownLon1;
                this.lat1 = (this.mouseMovePosY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat1;
            }
        }
    };

    onPointerUp = (event) => {
        event.preventDefault();
        if (this.state.loading) {
            return;
        }

        this.isUserInteracting = false;

        var clientX = this.mouseMovePosX;//event.clientX || event.touches[0].clientX;
        var clientY = this.mouseMovePosY;//event.clientY || event.touches[0].clientY;

        this.mouseUpPos.x = clientX;
        this.mouseUpPos.y = clientY;

        //console.log("dist: ", this.mouseDownPos.distanceTo(this.mouseUpPos));
        if (this.mouseDownPos.distanceTo(this.mouseUpPos) < 2) {
            this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (clientY / window.innerHeight) * 2 + 1;

            this.raycaster.setFromCamera(this.mouse, this.camera);

            // calculate objects intersecting the picking ray
            var intersects = this.raycaster.intersectObjects(this.scene.children);

            if (intersects.length > 0) {
                if (intersects[0].object.name === "hotspot") {
                    for (let i = 0; i < this.hotSpots.length; ++i) {
                        if (this.hotSpots[i].id === intersects[0].object.id) {
                            this.moveToHotSpotAtIndex(i);
                            break;
                        }
                    }
                }
            }
        }
    };

    onDocumentMouseWheel = (event) => {
        // var fov = this.camera.fov + event.deltaY * 0.05;
        // this.camera.fov = THREE.MathUtils.clamp(fov, 10, 75);
        // this.camera.updateProjectionMatrix();
    };

    update = () => {
        this.deltaTime = this.clock.getDelta();
        this.elapsedTime += this.deltaTime;

        if (this.isUserInteracting === false) {
            this.lon1 += 0.2;
        }

        if (this.rotateType === 0) {
            this.lat = Math.max(- 85.0, Math.min(85.0, this.lat));
            this.phi = THREE.MathUtils.degToRad(90.0 - this.lat);
            this.theta = THREE.MathUtils.degToRad(90.0 - this.lon);

            this.newTargetPos.x = 500 * Math.sin(this.phi) * Math.cos(this.theta) * -1;
            this.newTargetPos.y = 500 * Math.cos(this.phi) * -1;
            this.newTargetPos.z = 500 * Math.sin(this.phi) * Math.sin(this.theta);
            this.dummySphere.lookAt(this.newTargetPos);
            this.camera.quaternion.slerp(this.dummySphere.quaternion, 0.2);
        }
        else if (this.rotateType === 1) {
            this.lat1 = Math.max(- 85.0, Math.min(85.0, this.lat1));
            this.phi1 = THREE.MathUtils.degToRad(90.0 - this.lat1);
            this.theta1 = THREE.MathUtils.degToRad(90.0 - this.lon1);

            this.tempPos.x = 500.0 * Math.sin(this.phi1) * Math.cos(this.theta1) * -1;
            this.tempPos.y = 500.0 * Math.cos(this.phi1) * -1;
            this.tempPos.z = 500.0 * Math.sin(this.phi1) * Math.sin(this.theta1);
            this.currentModel.lookAt(this.tempPos);
        }

        // this.stats.update();
    };

    addHotspotAt = (x, y, z) => {
        var mat = this.hotSpotMat.clone();
        var hotspot = new THREE.Mesh(this.hotSpotGeometry, mat);
        mat.visible = false;
        hotspot.position.set(x, y, z);
        this.scene.add(hotspot);
        mat.dispose();
        hotspot.name = "hotspot";

        var nmat = this.hotSpotMat.clone();
        var hotspotPresenter = new THREE.Mesh(this.hotSpotPresenterGeometry, nmat);
        nmat.visible = true;
        hotspotPresenter.position.set(0, 0, 0);
        this.scene.add(hotspotPresenter);
        nmat.dispose();
        hotspotPresenter.name = "CylinderGeo";
        hotspot.add(hotspotPresenter);

        return hotspot;
    };

    moveToHotSpotAtIndex = (index) => {
        console.log(index);
        if (this.auditoriumEntryPoints.includes(index)) {
            console.log("moving to auditorium");
            this.props.history.push("/auditorium")
            return;
        }

        if (index >= exhibitionConfig["Items"].length)
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

        this.mesh.material = this.material;
        this.material = null;
        const hotspotConf = exhibitionConfig["Items"][this.currentIndex];
        this.camera.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        this.mesh.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        this.dummySphere.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);

        this.light.position.set(hotspotConf.x, hotspotConf.y + 10, hotspotConf.z * -1);

        // Hide Hotspots
        for (let i = 0; i < this.hotSpots.length; ++i) {
            this.hotSpots[i].visible = true;
        }
        console.log("this.currentIndex.toString(): ", this.currentIndex.toString());
        var toDisable = disables[this.currentIndex.toString()];
        console.log("toDisable.length: ", toDisable.length);
        console.log("this.hotSpots.length: ", this.hotSpots.length);
        for (let i = 0; i < toDisable.length; ++i) {
            console.log("toDisable[i]: ", toDisable[i]);
            this.hotSpots[toDisable[i]].visible = false;
        }

        for (let i = 0; i < this.lookTexts.length; ++i) {
            this.lookTexts[i].lookAt(this.camera.position);
        }

        this.removeAllStallButtons();
        if (this.currentIndex === 3) {
            this.addActionsForStall1();
        }

        if (this.currentIndex === 3 || this.currentIndex === 7) {
            if (this.loadedModels[0])
                this.loadedModels[0].visible = true;
        }
        else {
            if (this.loadedModels[0])
                this.loadedModels[0].visible = false;
        }
    };

    loadFont = () => {
        var loader = new THREE.FontLoader();
        loader.load('fonts/droid_sans_mono_regular.typeface.json', (response) => {
            this.font = response;
            // this.loadHotSpotText();
        });
    };

    loadHotSpotText = () => {
        let materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
        ];

        console.log("this.hotSpots.length: " + this.hotSpots.length);
        for (let i = 0; i < this.hotSpots.length; ++i) {

            if (i === 0)
                continue;
            let textGeo = new THREE.TextGeometry("" + i, {
                font: this.font,

                size: 0.3,
                height: 0,
                curveSegments: 4,

                bevelThickness: 0,
                bevelSize: 0,
                bevelEnabled: true

            });
            textGeo.computeBoundingBox();
            textGeo.computeVertexNormals();

            let textMesh1 = new THREE.Mesh(textGeo, materials);

            const hotspot = this.hotSpots[i];
            const offeset = 0;//(textGeo.boundingBox.max.x - textGeo.boundingBox.min.x) / 2;
            textMesh1.position.set(hotspot.position.x - offeset, hotspot.position.y + 0.2, hotspot.position.z);

            this.scene.add(textMesh1);

            textMesh1.lookAt(this.camera.position);

            this.lookTexts.push(textMesh1);

            textGeo.dispose();
        }
    };

    setQueueSize = (x, y, z, text) => {
        let textGeo = new THREE.TextGeometry(text, {
            font: this.font,
            size: 0.025,
            height: 0,
            curveSegments: 4,
            bevelThickness: 0,
            bevelSize: 0,
            bevelEnabled: true
        });

        textGeo.computeBoundingBox();
        textGeo.computeVertexNormals();

        if (this.queueSizeText) {
            this.scene.remove(this.queueSizeText);
            this.queueSizeText.dispose();
        }
        this.queueSizeText = new THREE.Mesh(textGeo, this.textMaterials);
        this.queueSizeText.tag = "text";
        this.queueSizeText.position.set(x, y, z);

        this.scene.add(this.queueSizeText);

        // this.queueSizeText.lookAt(this.camera.position);

        textGeo.dispose();
    };

    loadVideoCallButton = (x, y, z) => {

        if (!this.videoChatButton) {
            var planeGeometry = new THREE.PlaneGeometry(0.22, 0.22, 1, 1);
            var texture = new THREE.TextureLoader().load(button1Image);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            var planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
            planeMaterial.transparent = true;
            this.videoChatButton = new THREE.Mesh(planeGeometry, planeMaterial);
            this.videoChatButton.receiveShadow = true;

            this.videoChatButton.name = "VideoChat";
            planeMaterial.dispose();
            planeGeometry.dispose();
            texture.dispose();

            const boxgeometry = new THREE.BoxGeometry(0.25, 0.25, 0.05);
            const newBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x2c6216 });

            this.videoChatCube = new THREE.Mesh(boxgeometry, newBoxMaterial);
            this.videoChatCube.name = "VideoChat";

            boxgeometry.dispose();
            newBoxMaterial.dispose();
        }
        else {
            this.scene.remove(this.videoChatButton);
            this.scene.remove(this.videoChatCube);
        }

        this.videoChatButton.position.set(x, y + 0.01, z);
        this.scene.add(this.videoChatButton);

        this.videoChatCube.position.set(x, y, z - 0.03);
        this.scene.add(this.videoChatCube);
    };

    loadVideoPlayerButton = (x, y, z) => {

        if (!this.videoPlayerButton) {
            var planeGeometry = new THREE.PlaneGeometry(0.22, 0.22, 1, 1);
            var texture = new THREE.TextureLoader().load(videoPlayerButtonImage);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            var planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
            planeMaterial.transparent = true;
            this.videoPlayerButton = new THREE.Mesh(planeGeometry, planeMaterial);
            this.videoPlayerButton.receiveShadow = true;

            this.videoPlayerButton.name = "VideoViewer";
            planeMaterial.dispose();
            planeGeometry.dispose();
            texture.dispose();

            const boxgeometry = new THREE.BoxGeometry(0.25, 0.25, 0.05);
            const newBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x2c6216 });

            this.videoPlayerCube = new THREE.Mesh(boxgeometry, newBoxMaterial);
            this.videoPlayerCube.name = "VideoViewer";

            boxgeometry.dispose();
            newBoxMaterial.dispose();
        }
        else {
            this.scene.remove(this.videoPlayerButton);
            this.scene.remove(this.videoPlayerCube);
        }

        this.videoPlayerButton.position.set(x, y + 0.01, z);
        this.scene.add(this.videoPlayerButton);

        this.videoPlayerCube.position.set(x, y, z - 0.03);
        this.scene.add(this.videoPlayerCube);
    };

    loadPDFViewerButton = (x, y, z) => {

        if (!this.pdfViewerButton) {
            var planeGeometry = new THREE.PlaneGeometry(0.22, 0.22, 1, 1);
            var texture = new THREE.TextureLoader().load(pdfViewerButtonImage);
            texture.magFilter = THREE.LinearFilter;
            texture.minFilter = THREE.LinearFilter;
            var planeMaterial = new THREE.MeshBasicMaterial({ map: texture });
            planeMaterial.transparent = true;
            this.pdfViewerButton = new THREE.Mesh(planeGeometry, planeMaterial);
            this.pdfViewerButton.receiveShadow = true;

            this.pdfViewerButton.name = "PDFViewer";
            planeMaterial.dispose();
            planeGeometry.dispose();
            texture.dispose();

            const boxgeometry = new THREE.BoxGeometry(0.25, 0.25, 0.05);
            const newBoxMaterial = new THREE.MeshStandardMaterial({ color: 0x2c6216 });

            this.pdfViewerCube = new THREE.Mesh(boxgeometry, newBoxMaterial);
            this.pdfViewerCube.name = "PDFViewer";

            boxgeometry.dispose();
            newBoxMaterial.dispose();
        }
        else {
            this.scene.remove(this.pdfViewerButton);
            this.scene.remove(this.pdfViewerCube);
        }

        this.pdfViewerButton.position.set(x, y + 0.01, z);
        this.scene.add(this.pdfViewerButton);

        this.pdfViewerCube.position.set(x, y, z - 0.03);
        this.scene.add(this.pdfViewerCube);
    };

    sceneSetup = () => {
        this.clock = new Clock();
        this.clock.getDelta();
        this.elapsedTime = 0;
        this.deltaTime = 0;
        this.changeBackgroundTime = 0;
        this.lastIndex = 0;
        this.rotateType = 0;
        this.tempPos = new Vector3(0, 0, 0);
        this.currentModel = null;
        this.lookTexts = [];
        this.loadedModels = {};

        this.loader = new THREE.TextureLoader();

        this.textMaterials = [
            new THREE.MeshPhongMaterial({ color: 0x000000, flatShading: true }), // front
            new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
        ];

        // get container dimensions and use them for scene sizing
        const width = window.innerWidth;//this.el.clientWidth;
        const height = window.innerHeight;// this.el.clientHeight;

        this.hotspotsDict = {
            0: sphereimage0,
            1: sphereimage1,
            2: sphereimage2,
            3: sphereimage3,
            4: sphereimage4,
            5: sphereimage5,
            6: sphereimage6,
            7: sphereimage7,
            8: sphereimage8,
            9: sphereimage9,
            10: sphereimage10,
            11: sphereimage11,
            12: sphereimage12,
            13: sphereimage13,
            14: sphereimage14,
            15: sphereimage15,
            16: sphereimage16,
            17: sphereimage17,
            18: sphereimage18,
            19: sphereimage19,
        };

        this.models = {
            0: model3d_0
        }

        this.auditoriumEntryPoints = [11, 13];

        this.isUserInteracting = false;
        this.onMouseDownMouseX = 0;
        this.onMouseDownMouseY = 0;
        this.lon = 0;
        this.onMouseDownLon = 0;
        this.lat = 0;
        this.onMouseDownLat = 0;
        this.phi = 0;
        this.theta = 0;

        this.lon1 = 0;
        this.onMouseDownLon1 = 0;
        this.lat1 = 0;
        this.onMouseDownLat1 = 0;
        this.phi1 = 0;
        this.theta1 = 0;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            60, // fov = field of view
            width / height, // aspect ratio
            0.1, // near plane
            1000 // far plane
        );
        this.camera.target = new THREE.Vector3(0, 0, 0);
        this.newTargetPos = new THREE.Vector3(0, 0, 0);

        var dummySphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
        var dummyMat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        this.dummySphere = new THREE.Mesh(dummySphereGeometry, dummyMat);
        this.scene.add(this.dummySphere);
        dummyMat.dispose();
        dummySphereGeometry.dispose();

        this.renderer = new THREE.WebGL1Renderer({ antialias: true });

        var refPoint = new Vector3(0, 0, 0);
        for (let i = 0; i < exhibitionConfig["Items"].length; ++i) {
            const hotspot = this.addHotspotAt(exhibitionConfig["Items"][i].x - refPoint.x, refPoint.y, ((exhibitionConfig["Items"][i].z * -1) - refPoint.z));
            this.hotSpots.push(hotspot);
        }

        this.loadFont();

        // this.stats = new Stats();
        // this.stats.setMode(0);
        // this.stats.domElement.style.position = 'absolute';
        // this.stats.domElement.style.left = '0';
        // this.stats.domElement.style.top = '0';
        // document.body.appendChild(this.stats.domElement);

        var geometryS = new THREE.SphereBufferGeometry(50, 60, 40);
        geometryS.scale(- 1, 1, 1);
        var texture = new THREE.TextureLoader().load(this.hotspotsDict[0]);
        var material = new THREE.MeshBasicMaterial({ map: texture });
        this.mesh = new THREE.Mesh(geometryS, material);
        texture.dispose();
        material.dispose();
        geometryS.dispose();


        const hotspotConf = exhibitionConfig["Items"][this.currentIndex];
        this.dummySphere.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        this.camera.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);
        this.mesh.position.set(hotspotConf.x, hotspotConf.y + 1.7, hotspotConf.z * -1);

        this.scene.add(this.mesh);
        this.mesh.rotation.y = THREE.MathUtils.degToRad(270);
        this.mesh.position.set(0, 0, 0);

        this.renderer.setSize(width, height);
        this.el.appendChild(this.renderer.domElement); // mount using React ref

        this.moveToHotSpotAtIndex(this.currentIndex);

        ///-------------------------
        // Video texture

        this.video = document.getElementById('video1');
        this.video.volume = 0.0;
        this.video.play();
        this.video.addEventListener('play', function () {
            this.currentTime = 3;
        }, false);

        this.videoTexture = new THREE.VideoTexture(this.video);
        this.videoTexture.format = THREE.RGBFormat;
        var parameters = { color: 0xffffff, map: this.videoTexture };
        var geometry = new THREE.PlaneBufferGeometry(15, 8.4375, 5, 5);// BoxBufferGeometry(3, 3, 3);
        var videoMat = new THREE.MeshBasicMaterial(parameters);

        this.videoFrameMesh = new THREE.Mesh(geometry, videoMat);

        this.videoFrameMesh.position.x = -26.6;
        this.videoFrameMesh.position.y = 8.0;
        this.videoFrameMesh.position.z = 3;
        this.videoFrameMesh.rotation.set(0, MathUtils.degToRad(90), 0);
        this.scene.add(this.videoFrameMesh);
        geometry.dispose();
        videoMat.dispose();


        // Create box on top, bottom, left and side for frame

        var boxGeometry = new THREE.BoxGeometry(0.1, 9, 0.3);
        var box2Geometry = new THREE.BoxGeometry(0.1, 0.3, 15.3);
        var boxmaterial = new THREE.MeshBasicMaterial({ color: 0x474646 });

        var cube1 = new THREE.Mesh(boxGeometry, boxmaterial);
        cube1.position.set(-26.6, 8, 10.5);
        this.scene.add(cube1);

        var cube2 = new THREE.Mesh(boxGeometry, boxmaterial);
        cube2.position.set(-26.6, 8, -4.5);
        this.scene.add(cube2);

        var cube3 = new THREE.Mesh(box2Geometry, boxmaterial);
        cube3.position.set(-26.6, 3.65, 3);
        this.scene.add(cube3);

        var cube4 = new THREE.Mesh(box2Geometry, boxmaterial);
        cube4.position.set(-26.6, 12.4, 3);
        this.scene.add(cube4);

        box2Geometry.dispose();
        boxGeometry.dispose();
        boxmaterial.dispose();
        ///------------------------



        ///-------------------------
        // Transparent Video texture


        this.video2 = document.getElementById('video2');
        this.video2.volume = 0.0;
        this.video2.play();
        this.video2.addEventListener('play', function () {
            this.currentTime = 3;
        }, false);

        let greenVideoTexture = new THREE.VideoTexture(this.video2);
        greenVideoTexture.minFilter = THREE.LinearFilter;
        greenVideoTexture.magFilter = THREE.LinearFilter;
        var greenVideoGeometry = new THREE.PlaneBufferGeometry(7.855671, 4.418812, 5, 5);
        let keyColorObject = new THREE.Color(0xd432);

        var greenVideoMat = new THREE.ShaderMaterial({
            uniforms: {
                texture: {
                    type: "t",
                    value: greenVideoTexture
                },
                color: {
                    type: "c",
                    value: keyColorObject
                }
            },
            vertexShader:
                "varying mediump vec2 vUv;\n" +
                "void main(void)\n" +
                "{\n" +
                "vUv = uv;\n" +
                "mediump vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );\n" +
                "gl_Position = projectionMatrix * mvPosition;\n" +
                "}",
            fragmentShader:
                "uniform mediump sampler2D texture;\n" +
                "uniform mediump vec3 color;\n" +
                "varying mediump vec2 vUv;\n" +
                "void main(void)\n" +
                "{\n" +
                "  mediump vec3 tColor = texture2D( texture, vUv ).rgb;\n" +
                "  mediump float a = (length(tColor - color) - 0.5) * 7.0;\n" +
                "  gl_FragColor = vec4(tColor, a);\n" +
                "}",
            transparent: true
        });

        this.greenVideoFrameMesh = new THREE.Mesh(greenVideoGeometry, greenVideoMat);

        this.greenVideoFrameMesh.position.x = 15.9;
        this.greenVideoFrameMesh.position.y = 3.16;
        this.greenVideoFrameMesh.position.z = 3.32;
        this.greenVideoFrameMesh.rotation.set(0, MathUtils.degToRad(270), 0);
        this.scene.add(this.greenVideoFrameMesh);
        greenVideoGeometry.dispose();
        greenVideoMat.dispose();
        greenVideoTexture.dispose();

        //---------------

        // player background music

        // create an AudioListener and add it to the camera
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        // create a global audio source
        this.sound = new THREE.Audio(this.listener);

        // load a sound and set it as the Audio object's buffer
        var audioLoader = new THREE.AudioLoader();
        audioLoader.load(backgroundMusic, (buffer) => {
            if (this.sound) {
                this.sound.setBuffer(buffer);
                this.sound.setLoop(true);
                this.sound.setVolume(0.3);
                this.sound.play();
            }
        });

        //-------------------------

        this.load3DModel(0);

        // this.addActionsForStall1();
    };

    removeAllStallButtons = () => {
        this.scene.remove(this.videoChatButton);
        this.scene.remove(this.videoChatCube);

        this.scene.remove(this.pdfViewerButton);
        this.scene.remove(this.pdfViewerCube);

        this.scene.remove(this.videoPlayerButton);
        this.scene.remove(this.videoPlayerCube);
    };

    addActionsForStall1 = () => {
        this.loadVideoCallButton(-12.100, 1.129, -11.265);
        // this.setQueueSize(this.videoChatButton.position.x - 0.1, this.videoChatButton.position.y, this.videoChatButton.position.z + 0.1, "Queue:3");

        this.loadPDFViewerButton(-12.400, 1.129, -11.265);

        this.loadVideoPlayerButton(-12.700, 1.129, -11.265);
    };

    addCustomSceneObjects = () => {
        // const lights = [];
        this.light = new THREE.PointLight(0xffffff, 5, 0);
        // lights[1] = new THREE.PointLight(0xffffff, 2, 0);
        // lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        // lights[0].position.set(2, 2, 2);
        // lights[1].position.set(100, 200, 100);
        // lights[2].position.set(- 100, - 200, - 100);

        this.scene.add(this.light);
        // this.scene.add(lights[1]);
        // this.scene.add(lights[2]);

        var sphereSize = 1;
        var pointLightHelper = new THREE.PointLightHelper(this.light, sphereSize);
        this.scene.add(pointLightHelper);
    };
    startAnimationLoop = () => {
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
                    texture.magFilter = THREE.LinearFilter;
                    texture.minFilter = THREE.LinearFilter;
                    this.material = new THREE.MeshBasicMaterial({ map: texture });
                    this.material.map.minFilter = THREE.LinearFilter;
                    this.material.map.magFilter = THREE.LinearFilter;
                    texture.dispose();

                    this.actualMoveToNewHotSpot();

                    this.setState({ loading: false });
                },
                // onProgress callback currently not supported
                undefined,
                // onError callback
                function (err) {
                    console.error('An error happened.');
                    this.setState({ loading: false });
                }
            );
        }
        else {
            console.log("Cannot load null paths Skipping it");
            this.setState({ loading: false });
        }
    };

    load3DModel = (index) => {
        var fbxloader = new FBXLoader();
        fbxloader.load(this.models[index], (object) => {

            // var mixer = new THREE.AnimationMixer(object);

            // var action = mixer.clipAction(object.animations[0]);
            // action.play();

            object.traverse(function (child) {

                if (child.isMesh) {

                    child.castShadow = true;
                    child.receiveShadow = true;

                }

            });

            const modelData = modelsConfig["Items"][index];
            var mat = this.hotSpotMat.clone();
            var newGeometry = new THREE.SphereGeometry(0.6, 8, 8);
            var modelParent = new THREE.Mesh(newGeometry, mat);
            mat.visible = false;
            modelParent.position.set(modelData.x, modelData.y, modelData.z * -1);
            this.scene.add(modelParent);
            mat.dispose();
            modelParent.name = "3DModel";

            object.position.set(0, 0, 0);
            object.scale.set(0.001, 0.001, 0.001);
            modelParent.add(object);
            this.scene.add(modelParent);

            this.loadedModels[index] = modelParent;
        }, undefined, function (e) {

            console.error(e);

        });
    }

    noConfirmationDialogAction = () => {
        this.setState({ showVideoCallPermissionDialog: false });
    };

    yesConfirmationDialogAction = () => {
        this.setState({ showVideoCallPermissionDialog: false });

        console.log("Show Queue");

        this.props.applyForSalesVideoCall("ap-south-1_EH6LoIlGK:479a2353-dbec-47be-b6ca-e7affe6558a1");
    };

    closePDFViewer = () => {
        this.setState({ showPDFViewer: false });
    };

    closeVideoPlayer = () => {
        this.setState({ showVideoPlayer: false });
    };

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (<div>
            <div ref={ref => (this.el = ref)} />
            {this.state.loading && <Loader type="Oval" color="#FFFFFF" height={60} width={60} timeout={300000} //3 secs
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'tranform(-50%, -50%)' }} />}
            {/* <FeedbackForm />  */}
            {this.state.showPDFViewer && <PdfViewer closePDFViewer={this.closePDFViewer} />}
            {this.state.showVideoPlayer && <VimeoPlayer closeVideoPlayer={this.closeVideoPlayer} />}
            {this.state.showVideoCallPermissionDialog && <ConfirmationDialog noConfirmationDialogAction={this.noConfirmationDialogAction} yesConfirmationDialogAction={this.yesConfirmationDialogAction} message="Do you want to have Video call with exhibitor?" title="Video Call!" />}
        </div>
        );
    }
};

export default Game;