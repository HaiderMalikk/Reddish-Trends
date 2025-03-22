"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { randFloat } from "three/src/math/MathUtils";
import "./styles/three-js-styles.css";

gsap.registerPlugin(ScrollTrigger);

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const text = "WWelcome To Reddish Trends!";
  const [displayedText, setDisplayedText] = useState<string>("");
  const [doneAnimation, setDoneAnimation] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  // Set loaded state after component mounts
  useEffect(() => {
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!mountRef.current || !loaded) return;

    // Scene & Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight, true);
    renderer.setPixelRatio(window.devicePixelRatio); // Set pixel ratio for higher resolution
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight, true);
      renderer.setPixelRatio(window.devicePixelRatio); // Update pixel ratio on resize
    };

    window.addEventListener("resize", handleResize);

    // Rounded Cube Geometry
    const createRoundedBoxGeometry = (
      width: number,
      height: number,
      depth: number,
      radius: number,
      segments: number,
    ) => {
      const shape = new THREE.Shape();
      const eps = 0.00001;
      const radius0 = radius - eps;
      shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
      shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
      shape.absarc(
        width - radius * 2,
        height - radius * 2,
        eps,
        Math.PI / 2,
        0,
        true,
      );
      shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: depth - radius * 2,
        bevelEnabled: true,
        bevelSegments: segments,
        steps: 1,
        bevelSize: radius0,
        bevelThickness: radius,
        curveSegments: segments,
      });
      geometry.center();
      return geometry;
    };

    const geometry = createRoundedBoxGeometry(1, 1, 1, 0.1, 10);
    const material = new THREE.MeshStandardMaterial({
      color: 0x000,
      roughness: 0.5,
      metalness: 0.5,
    });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    // Add hover animation as a function to be called after entrance animation completes
    const startHoverAnimation = () => {
      // Clear any existing animations on cube.position.y
      gsap.killTweensOf(cube.position, "y");

      // Start the hover animation
      gsap.to(cube.position, {
        y: "+=0.1",
        duration: 1.5,
        ease: "power1.inOut",
        yoyo: true,
        repeat: -1,
        repeatDelay: 0.1,
      });
    };

    // Add lighting for better quality
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.set(-10, -15, 10);
    scene.add(directionalLight2);

    // Function to create a blinking eye
    const createEye = (x: number, y: number) => {
      let eyeHeight = 0.25; // Dynamic height for blinking
      let pupilHeight = 0.1;

      const eyeShape = new THREE.Shape();
      eyeShape.absellipse(0, 0, 0.1, eyeHeight, 0, Math.PI * 2);

      // Blinking animation

      const eyeGeometry = new THREE.ShapeGeometry(eyeShape);
      const eyeMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const eyeMesh = new THREE.Mesh(eyeGeometry, eyeMaterial);
      eyeMesh.position.set(x, y, 0.001);

      // Pupil
      const pupilShape = new THREE.Shape();
      pupilShape.absellipse(0, 0, 0.05, pupilHeight, 0, Math.PI * 2);

      const pupilGeometry = new THREE.ShapeGeometry(pupilShape);
      const pupilMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const pupilMesh = new THREE.Mesh(pupilGeometry, pupilMaterial);
      pupilMesh.position.set(x, y, 0.01);

      return { eyeMesh, pupilMesh, eyeGeometry, pupilGeometry };
    };

    // Function to add a face to the cube with eyes
    const addFace = (rotation: THREE.Euler, position: THREE.Vector3) => {
      const faceGroup = new THREE.Group();

      const leftEye = createEye(-0.2, 0);
      const rightEye = createEye(0.2, 0);

      faceGroup.add(
        leftEye.eyeMesh,
        leftEye.pupilMesh,
        rightEye.eyeMesh,
        rightEye.pupilMesh,
      );
      faceGroup.rotation.copy(rotation);
      faceGroup.position.copy(position);

      cube.add(faceGroup);

      return [leftEye, rightEye];
    };

    // Attach faces to the cube (front, back, left, right, top, bottom) with eyes
    const faces = [
      addFace(new THREE.Euler(0, 0, 0), new THREE.Vector3(0, 0, 0.5)), // Front
      addFace(new THREE.Euler(0, Math.PI, 0), new THREE.Vector3(0, 0, -0.5)), // Back
      addFace(new THREE.Euler(0, Math.PI / 2, 0), new THREE.Vector3(0.5, 0, 0)), // Right
      addFace(
        new THREE.Euler(0, -Math.PI / 2, 0),
        new THREE.Vector3(-0.5, 0, 0),
      ), // Left
    ].flat();

    // Function to trigger a blink animation
    const blink = () => {
      faces.forEach(({ eyeMesh, pupilMesh, eyeGeometry, pupilGeometry }) => {
        // Shrink eyes and pupils for blink
        gsap.to(eyeMesh.scale, {
          y: 0.1,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
        gsap.to(pupilMesh.scale, {
          y: 0.05,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      });

      setTimeout(blink, Math.random() * 3000 + 2000); // Random blinks every 2-5 sec
    };
    blink(); // Start blinking loop

    // Function to randomly move eyes with different ranges for each
    const moveEyes = () => {
      // here i moce the pupils of the eyes to make them look around by adding a offset to the x and y position
      // the two ofsets for the two eyes are neg and pos but i cant have 2 randoms for each eye as that would be cross eyed
      // insted i make 1 random and negate it for the other eye, and there outside the loop so each face has the same movement
      let xmovementR: number = randFloat(0.15, 0.2); // pos
      let xmovementL: number = -xmovementR; // neg
      let ymovement: number = randFloat(-0.1, 0.1); // neg to pos
      faces.forEach(({ pupilMesh }, index) => {
        if (index % 2 === 0) {
          // Left Eye (pupil range: 0.1 to 0.2)
          gsap.to(pupilMesh.position, {
            x: xmovementL,
            y: ymovement, // Common y range for both eyes
            duration: 2,
            ease: "power1",
            yoyo: true,
          });
        } else {
          // Right Eye (pupil range: -0.1 to -0.2)
          gsap.to(pupilMesh.position, {
            x: xmovementR,
            y: ymovement, // Common y range for both eyes
            duration: 2,
            ease: "power1",
            yoyo: true,
          });
        }
      });
    };
    // call the function over and over again
    setInterval(moveEyes, 3000);

    // banner for text animation with gsap
    const animateBanner = () => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current,
          { left: "100%" },
          {
            left: "50%",
            transform: "translateX(-50%)", // Center horizontally
            duration: 1,
            ease: "power2.inOut",
          },
        );
      }
    };

    const animatetext = () => {
      let index = 0;
      const typingInterval = setInterval(() => {
        setDisplayedText((prev) => prev + text[index]);
        index++;

        // When we reach the end of the text
        if (index === text.length - 1) {
          clearInterval(typingInterval);
        }
      }, 55); // Typing speed overall
    };

    // Animation loop - Modified to create a hover effect instead of constant rotation
    const animate = () => {
      requestAnimationFrame(animate);
      // No longer applying continuous rotation
      renderer.render(scene, camera);
    };
    animate();

    // Animation for cube to come into frame from top right with smooth deceleration
    gsap.fromTo(
      cube.position,
      { x: 5, y: 5 },
      {
        x: 0,
        y: 0,
        duration: 2,
        ease: "power3.out",
        onComplete: function () {
          // Now start the hover animation after the entrance is complete
          startHoverAnimation();
        },
      },
    );

    gsap.fromTo(
      cube.rotation,
      { x: Math.PI * 2, y: Math.PI * 2 },
      {
        x: 0,
        y: 0,
        duration: 2,
        ease: "power3.out",
        onComplete: () => {
          setDoneAnimation(true);
          animateBanner();
          animatetext();
        },
      },
    );

    // ScrollTrigger to spin and move cube when scrolling off + onenter to spin on entering the page section and on leave back to spin as the cube comes back into view
    ScrollTrigger.create({
      trigger: mountRef.current,
      start: "top top",
      end: "bottom top",
      onEnter: () => {
        gsap.killTweensOf(cube.position, "y"); // Kill hover animation
        gsap.to(cube.rotation, {
          x: "+=" + Math.PI * 2,
          duration: 0.5,
          ease: "power2.inOut",
        });
        gsap.to(cube.position, {
          y: -5,
          duration: 1,
          ease: "power2.inOut",
        });

        // Animate text back to the right side of the screen
        if (textRef.current) {
          gsap.to(textRef.current, {
            left: "100%",
            transform: "translateX(0)",
            duration: 1,
            ease: "power2.inOut",
          });
        }
      },
      onLeaveBack: () => {
        gsap.killTweensOf(cube.position, "y"); // Kill any existing animations
        gsap.to(cube.rotation, {
          x: "+=" + Math.PI * 2,
          duration: 1,
          ease: "power2.inOut",
        });
        gsap.to(cube.position, {
          y: 0,
          duration: 1,
          ease: "power2.inOut",
          onComplete: startHoverAnimation, // Restart hover after returning
        });

        // Bring text back to center without retyping
        if (textRef.current) {
          gsap.to(textRef.current, {
            left: "50%",
            transform: "translateX(-50%)",
            duration: 1,
            ease: "power2.inOut",
          });
        }
      },
    });

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [loaded]);

  // conditional rendering for loading, until component is loaded show a loading screen
  return (
    <>
      {!loaded ? (
        <div className="flex h-screen items-center justify-center bg-black">
          {/* Spinner */}
          <div className="spinner m-8">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <h1 className="text-customColor2">Loading...</h1>
        </div>
      ) : (
        <>
          <div className="scene-container">
            <div ref={mountRef} className="three-scene" />
            <div
              ref={textRef}
              className="animated-text text-4xl"
              style={{ opacity: doneAnimation ? 1 : 0 }} // Hide text until animation is done
            >
              {doneAnimation && displayedText}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ThreeScene;
