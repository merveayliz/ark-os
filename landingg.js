/**
 * THE 100 PROJECT - LANDING PROTOCOL JS
 * * Bu dosya 3 temel işi yapar:
 * 1. Three.js ile 3D Dünya ve Uzay ortamını oluşturur.
 * 2. Kullanıcı adını alıp tarayıcı hafızasına (localStorage) kaydeder.
 * 3. Sahneler arası (Giriş -> Panel -> Yeni Sayfa) geçiş animasyonlarını yönetir.
 */

// Global değişkenler: Bu değişkenler tüm fonksiyonların dışındadır, 
// çünkü hem oluşturma (init) hem de hareket (animate) sırasında onlara her yerden ulaşmamız gerekir.
let scene, camera, renderer, earth, clouds, stars;

function init() {
    // 1. SAHNE VE KAMERA AYARLARI
    scene = new THREE.Scene(); // Boş bir 3D evren oluşturur.
    // PerspectiveCamera: İnsan gözünün gördüğü gibi derinliği olan bir bakış açısı sağlar.
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 3; // Kamerayı başlangıçta dünyadan 3 birim geriye koyar.

    // 2. RENDERER (ÇİZİCİ): Kodlarımızı ekrana görsel olarak yansıtan motor.
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById("earthCanvas"), // HTML'deki canvas'ı kullan
        antialias: true, // Kenarları pürüzsüzleştirir (daha net görüntü)
        alpha: true      // Arka planın şeffaf olmasına izin verir
    });
    renderer.setSize(window.innerWidth, window.innerHeight); // Pencere boyutuna eşitle
    renderer.setPixelRatio(window.devicePixelRatio); // Telefon/Bilgisayar ekran kalitesine göre netliği ayarlar.

    // 3. DOKU YÜKLEYİCİ: Resimleri 3D objelerin üzerine kaplamak için kullanılır.
    const loader = new THREE.TextureLoader();

    // 4. DÜNYA OLUŞTURMA
    const geometry = new THREE.SphereGeometry(1, 64, 64); // 1 birim çapında pürüzsüz bir küre iskeleti.
    const material = new THREE.MeshPhongMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg'), // Kara/Deniz resmi
        specularMap: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg'), // Su yansıması resmi
        shininess: 10 // Işığın parlama miktarı
    });
    earth = new THREE.Mesh(geometry, material); // İskelet ve kaplamayı birleştir.
    scene.add(earth); // Sahneye ekle.

    // 5. BULUT KATMANI
    const cloudGeometry = new THREE.SphereGeometry(1.02, 64, 64); // Dünyadan birazcık daha büyük (1.02) bir küre.
    const cloudMaterial = new THREE.MeshPhongMaterial({
        map: loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png'), // Bulut resmi
        transparent: true, // Bulutların arasındaki boşluklardan dünya görünsün
        opacity: 0.5      // Bulutların şeffaflık seviyesi
    });
    clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    earth.add(clouds); // Bulutları dünyaya bağla (Böylece dünya dönünce bulutlar da döner).

    // 6. YILDIZLAR (UZAY BOŞLUĞU)
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 3000; // 3000 adet yıldız noktası oluştur.
    const posArray = new Float32Array(starCount * 3); // Her yıldız için X, Y, Z koordinatları.
    for(let i=0; i < starCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 20; // Yıldızları rastgele dağıt.
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 0.007, color: 0xffffff }); // Yıldız boyutu ve rengi.
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // 7. IŞIKLANDIRMA
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.3); // Güneş gibi tek yönden gelen güçlü ışık.
    sunLight.position.set(5, 3, 5); // Işığın açısı.
    scene.add(sunLight);
    scene.add(new THREE.AmbientLight(0x222222)); // Karanlıkta kalan yerlerin tamamen siyah olmaması için hafif ortam ışığı.

    earth.position.x = 1.2; // Dünyayı ekranın sağına kaydır (Sol tarafa menü gelecek).
    animate(); // Döngüyü başlat.
}

// ANİMASYON DÖNGÜSÜ: Saniyede 60 kez çalışır.
function animate() {
    requestAnimationFrame(animate); // Tarayıcıya "sürekli çizim yap" komutu verir.
    earth.rotation.y += 0.0015;  // Dünyayı kendi ekseninde döndürür.
    clouds.rotation.y += 0.0005; // Bulutları daha yavaş döndürür (Derinlik hissi).
    stars.rotation.y -= 0.0002;  // Yıldızları çok hafif ters yöne kaydırır.
    renderer.render(scene, camera); // Yapılan değişiklikleri ekrana yansıt.
}

// --- KULLANICI ETKİLEŞİM FONKSİYONLARI ---

// 1. ADIM: İSİM KAYDI
function kaydet() {
    const input = document.getElementById("kullanici-ad");
    const isim = input.value;

    if(isim.trim() === "") {
        alert("Kimliğini doğrula Skaikru!"); // Boş bırakılırsa uyarı ver.
        return;
    }

    // İsmi tarayıcının yerel hafızasına kaydet (Sayfa kapansa da silinmez).
    localStorage.setItem("kullaniciAdi", isim); 
    
    // UI Değişikliği: Giriş kutusunu gizle, onay butonunu göster.
    document.getElementById("kayit-alani").classList.add("gizli");
    document.getElementById("inis-onay").classList.remove("gizli");
    document.getElementById("selamlama").innerHTML = `SİSTEM ERİŞİMİ ONAYLANDI: <span style="color:#00ff96">${isim.toUpperCase()}</span>`;
}

// 2. ADIM: DÜNYA'YA İNİŞ ANİMASYONU
function dunyayaIn() {
    let scale = 1;
    document.getElementById("sahne-giris").classList.add("gizli"); // Formu gizle.

    // setInterval: Belirli aralıklarla (30ms) içindeki kodu çalıştırır.
    const inisInterval = setInterval(() => {
        scale += 0.15; // Dünyayı her adımda büyütür.
        earth.scale.set(scale, scale, scale);
        camera.position.z -= 0.02; // Kamerayı dünyaya yaklaştırır (Zoom hissi).

        if(scale > 10) { // Belirli bir büyüklüğlüğe ulaştığında dur.
            clearInterval(inisInterval);
            
            // Sahne-giris'i tamamen kapatıp şehir seçim panelini aç.
            document.getElementById("sahne-giris").style.display = "none";
            document.getElementById("sahne-panel").style.display = "block";
            
            // Yumuşak geçiş için kısa bir gecikme ile görünür yap.
            setTimeout(() => {
                document.getElementById("sahne-panel").classList.remove("gizli");
            }, 50);
        }
    }, 30);
}

// 3. ADIM: ŞEHİR SEÇİMİ VE YÖNLENDİRME
function finalGecis(bolge) {
    // Hafızadaki kullanıcı adını al (Daha önce kaydetmiştik).
    const isim = localStorage.getItem("kullaniciAdi");
    
    // Klasör yapısına uygun dosya adı oluşturma:
    // "MOUNT WEATHER" -> "mount-weather.html" (Küçük harf yap ve boşluklara tire koy)
    const sayfaAdi = bolge.toLowerCase().replace(/ /g, "-") + ".html";
    
    console.log(bolge + " koordinatlarına gidiliyor...");

    // 0.5 saniye sonra seçilen şehre git.
    setTimeout(() => {
        window.location.href = sayfaAdi;
    }, 500);
}

// PENCERE BOYUTU AYARI: Kullanıcı tarayıcıyı küçültürse görüntüyü bozmadan yeniden boyutlandırır.
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Programı çalıştıran ilk komut.
init();