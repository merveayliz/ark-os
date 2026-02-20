
let scene, camera, renderer, earth, clouds, stars;

function init() {
  
    scene = new THREE.Scene(); 
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3; 


    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById("earthCanvas"),
        antialias: true, 
        alpha: true     
    });
    renderer.setSize(window.innerWidth, window.innerHeight); 
    renderer.setPixelRatio(window.devicePixelRatio); 

 
    const loader = new THREE.TextureLoader();

   
    const geometry = new THREE.SphereGeometry(1, 64, 64); 
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'),
        specularMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'),
        shininess: 10
    });
    earth = new THREE.Mesh(geometry, material); 
    scene.add(earth); 

 
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64); 
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'), 
        transparent: true,
        opacity: 0.5    
    });
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earth.add(clouds); 

   
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000; 
    const posArray = new Float32Array(starCount * 3);
    for(let i=0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; 
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.007, color: 0xffffff }); 
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

  
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.3); 
    sunLight.position.set(5, 3, 5);
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x222222)); 

    earth.position.x = 1.2;
    animate(); 
}


function animate() {
    requestAnimationFrame(animate); 
    earth.rotation.y += 0.0015;
    clouds.rotation.y += 0.0005; 
    stars.rotation.y -= 0.0002; 
    renderer.render(scene, camera); 
}


function kaydet() {
    const input = document.getElementById("kullanici-ad");
    const isim = input.value;

    if(isim.trim() === "") {
        alert("Kimliğini doğrula Skaikru!"); 
        return;
    }

 
    localStorage.setItem("kullaniciAdi", isim); 
    

    document.getElementById("kayit-alani").classList.add("gizli");
    document.getElementById("inis-onay").classList.remove("gizli");
    document.getElementById("selamlama").innerHTML = `SİSTEM ERİŞİMİ ONAYLANDI: <span style="color:#00ff96">${isim.toUpperCase()}</span>`;
}


function dunyayaIn() {
    let scale = 1;
    document.getElementById("sahne-giris").classList.add("gizli");

   
    const inisInterval = setInterval(() => {
        scale += 0.15;
        earth.scale.set(scale, scale, scale);
        camera.position.z -= 0.02; 

        if(scale > 10) {  
            clearInterval(inisInterval);
            
            
            document.getElementById("sahne-giris").style.display = "none";
            document.getElementById("sahne-panel").style.display = "block";
            
           
            setTimeout(() => {
                document.getElementById("sahne-panel").classList.remove("gizli");
            }, 50);
        }
    }, 30);
}


function finalGecis(bolge) {
   
    const isim = localStorage.getItem("kullaniciAdi");
    
  
    const sayfaAdi = bolge.toLowerCase().replace(/ /g, "-") + ".html";
    
    console.log(bolge + " koordinatlarına gidiliyor...");

   
    setTimeout(() => {
        window.location.href = sayfaAdi;
    }, 500);
}


window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

init();
