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
import sphereimage9 from "../textures/360render_9.jpeg";
import sphereimage11 from "../textures/360render_11.jpeg";
import sphereimage12 from "../textures/360render_12.jpeg";
import sphereimage13 from "../textures/360render_13.jpeg";
import sphereimage14 from "../textures/360render_14.jpeg";
import sphereimage15 from "../textures/360render_15.jpeg";
import { Clock, Vector3, MathUtils } from 'three';
import disables from "../assets/exports/disables.json";
import exhibitionConfig from '../assets/exports/exhibitionexportdata.json';
import modelsConfig from '../assets/exports/modelsexportdata.json';
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import Loader from 'react-loader-spinner'
import backgroundMusic from "../sounds/backgroundMusic.mp3";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';
import model3d_0 from '../models/Coir2.fbx';
import VimeoPlayer from './vimeoPlayer';
import PdfViewer from './pdfViewer';
import FeedbackForm from './feedbackForm';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    lists: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start',
    },
    h4: {
        marginTop: '0px',
        marginBottom: '10px',
        color: '#004D6D'
    },
    h2: {
        textAlign: 'center'
    },
    listText: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'start',
        marginBottom: '20px'
    },
    tickImg: {
        marginRight: '10px'
    }
}));


class Titles3D extends Component {
    state = {
        loading: false
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

        // this.state.classes = useStyles();

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

        // // let searchStr = this.props.location.search;
        // // let stall_id = 50;
        // // if (searchStr.length > 0) {
        // //     let newString = searchStr.replace('?', '');
        // //     let res = newString.split("&");
        // //     for (let i = 0; i < res.length; ++i) {
        // //         let indres = newString.split("=");
        // //         if (indres.length === 2 && indres[0] === "stall_id") {
        // //             stall_id = parseInt(indres[1]);
        // //         }
        // //     }
        // // }

        // this.currentIndex = (stall_id - 50) % 5;

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

        // this.sound.stop();
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

        if (!(event.clientX || event.touches))
            return;

        this.isUserInteracting = true;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

        this.onMouseDownMouseX = clientX;
        this.onMouseDownMouseY = clientY;

        this.mouseDownPos.x = clientX;
        this.mouseDownPos.y = clientY;

        this.rotateType = 0;

        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.camera);

        // calculate objects intersecting the picking ray
        var intersects = this.raycaster.intersectObjects(this.scene.children);

        if (intersects.length > 0) {
            console.log(intersects[0].object.name);
            if (intersects[0].object.name === "3DModel") {
                this.rotateType = 1;
                this.currentModel = intersects[0].object;
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

            if (!(event.clientX || event.touches))
                return;

            var clientX = event.clientX || event.touches[0].clientX;
            var clientY = event.clientY || event.touches[0].clientY;

            if (this.rotateType === 0) {
                this.lon = (this.onMouseDownMouseX - clientX) * 0.2 + this.onMouseDownLon;
                this.lat = (clientY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat;
            }
            else if (this.rotateType === 1) {
                this.lon1 = (this.onMouseDownMouseX - clientX) * 0.2 + this.onMouseDownLon1;
                this.lat1 = (clientY - this.onMouseDownMouseY) * 0.2 + this.onMouseDownLat1;
            }
        }
    };

    onPointerUp = (event) => {
        event.preventDefault();

        if (this.state.loading) {
            return;
        }

        this.isUserInteracting = false;

        if (!(event.clientX || event.touches))
            return;

        var clientX = event.clientX || event.touches[0].clientX;
        var clientY = event.clientY || event.touches[0].clientY;

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
                console.log(intersects[0].object.name);
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
        var toDisable = disables[this.currentIndex.toString()];
        for (let i = 0; i < toDisable.length; ++i) {
            this.hotSpots[toDisable[i]].visible = false;
        }
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

        this.loader = new THREE.TextureLoader();

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
            8: null,
            9: sphereimage9,
            10: null,
            11: sphereimage11,
            12: sphereimage12,
            13: sphereimage13,
            14: sphereimage14,
            15: sphereimage15
        };

        this.models = {
            0: model3d_0
        }

        this.auditoriumEntryPoints = [8, 10];

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

        var refPoint = new Vector3(0, 0, 0);
        for (let i = 0; i < exhibitionConfig["Items"].length; ++i) {
            const hotspot = this.addHotspotAt(exhibitionConfig["Items"][i].x - refPoint.x, refPoint.y, ((exhibitionConfig["Items"][i].z * -1) - refPoint.z));
            this.hotSpots.push(hotspot);
        }

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
        this.videoTexture.minFilter = THREE.LinearFilter;
        this.videoTexture.magFilter = THREE.LinearFilter;
        this.videoTexture.format = THREE.RGBFormat;
        var parameters = { color: 0xffffff, map: this.videoTexture };
        var geometry = new THREE.PlaneBufferGeometry(11.6832, 6.5718, 5, 5);// BoxBufferGeometry(3, 3, 3);
        var videoMat = new THREE.MeshBasicMaterial(parameters);

        this.videoFrameMesh = new THREE.Mesh(geometry, videoMat);

        this.videoFrameMesh.position.x = -26.6;
        this.videoFrameMesh.position.y = 7;
        this.videoFrameMesh.position.z = 1;
        this.videoFrameMesh.rotation.set(0, MathUtils.degToRad(90), 0);
        this.scene.add(this.videoFrameMesh);
        geometry.dispose();
        videoMat.dispose();


        // Create box on top, bottom, left and side for frame

        var boxGeometry = new THREE.BoxGeometry(0.1, 7, 0.3);
        var box2Geometry = new THREE.BoxGeometry(0.1, 0.3, 12.3);
        var boxmaterial = new THREE.MeshBasicMaterial({ color: 0x474646 });

        var cube1 = new THREE.Mesh(boxGeometry, boxmaterial);
        cube1.position.set(-26.6, 7, 7);
        this.scene.add(cube1);

        var cube2 = new THREE.Mesh(boxGeometry, boxmaterial);
        cube2.position.set(-26.6, 7, -5);
        this.scene.add(cube2);

        var cube3 = new THREE.Mesh(box2Geometry, boxmaterial);
        cube3.position.set(-26.6, 3.6, 1);
        this.scene.add(cube3);

        var cube4 = new THREE.Mesh(box2Geometry, boxmaterial);
        cube4.position.set(-26.6, 10.4, 1);
        this.scene.add(cube4);

        box2Geometry.dispose();
        boxGeometry.dispose();
        boxmaterial.dispose();
        ///------------------------

        // player background music

        // create an AudioListener and add it to the camera
        this.listener = new THREE.AudioListener();
        this.camera.add(this.listener);

        // create a global audio source
        this.sound = new THREE.Audio(this.listener);

        // load a sound and set it as the Audio object's buffer
        // var audioLoader = new THREE.AudioLoader();
        // audioLoader.load(backgroundMusic, (buffer) => {
        //     this.sound.setBuffer(buffer);
        //     this.sound.setLoop(true);
        //     this.sound.setVolume(0.3);
        //     this.sound.play();
        // });

        //-------------------------

        // this.load3DModel(0);
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
            var newGeometry = new THREE.SphereGeometry(1, 8, 8);
            var modelParent = new THREE.Mesh(newGeometry, mat);
            mat.visible = false;
            modelParent.position.set(modelData.x, modelData.y, modelData.z * -1);
            this.scene.add(modelParent);
            mat.dispose();
            modelParent.name = "3DModel";

            object.position.set(0, 0, 0);
            object.scale.set(0.1, 0.1, 0.1);
            modelParent.add(object);
            this.scene.add(modelParent);
        }, undefined, function (e) {

            console.error(e);

        });
    }

    renderScene() {
        this.renderer.render(this.scene, this.camera);
    }

    render() {
        return (

            <div
                style={{ width: "800px", height: "800px" }}
                ref={mount => { this.el = mount }}
            />
            // <div ref={ref => (this.el = ref)} />
        );
    }
};

export default Titles3D;