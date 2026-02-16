       // --- LOGIC GAME (GIỮ NGUYÊN) ---
        const player = document.getElementById('player');
        const gameScreen = document.getElementById('game-screen');
        const scoreEl = document.getElementById('score');
        let score = 0; let isRunning = false; let spawnTimer;

        function moveHandler(clientX) {
            if (!isRunning) return;
            const containerWidth = window.innerWidth;
            let x = clientX - 40;
            if (x < 0) x = 0;
            if (x > containerWidth - 80) x = containerWidth - 80;
            player.style.left = x + 'px';
        }
        document.addEventListener('touchmove', (e) => { if (isRunning) { e.preventDefault(); moveHandler(e.touches[0].clientX); } }, { passive: false });
        document.addEventListener('mousemove', (e) => { if (isRunning) moveHandler(e.clientX); });

        function startGame() { document.getElementById('start-screen').style.display = 'none'; gameScreen.style.display = 'block'; score = 0; scoreEl.innerText = score; isRunning = true; spawnTimer = setInterval(spawnItem, 700); requestAnimationFrame(gameLoop); }

        function spawnItem() {
            if (!isRunning) return;
            const item = document.createElement('div'); item.classList.add('item');
            const rand = Math.random();
            if (rand < 0.6) { item.innerText = '🧧'; item.dataset.val = 1; } else if (rand < 0.85) { item.innerText = '🌼'; item.dataset.val = 2; } else { item.innerText = '😢'; item.dataset.val = -2; }
            item.style.left = Math.random() * (window.innerWidth - 50) + 'px'; item.style.top = '-60px'; gameScreen.appendChild(item);
            let y = -60; const speed = Math.random() * 3 + 4;
            function fall() {
                if (!isRunning) { item.remove(); return; }
                y += speed; item.style.top = y + 'px';
                const pRect = player.getBoundingClientRect(); const iRect = item.getBoundingClientRect();
                if (iRect.bottom >= pRect.top + 20 && iRect.right >= pRect.left + 10 && iRect.left <= pRect.right - 10 && iRect.top <= pRect.bottom) { updateScore(parseInt(item.dataset.val)); item.remove(); return; }
                if (y > window.innerHeight) { item.remove(); return; }
                requestAnimationFrame(fall);
            }
            requestAnimationFrame(fall);
        }
        function updateScore(val) { score += val; if (score < 0) score = 0; scoreEl.innerText = score; if (score >= 20) winGame(); }
        function gameLoop() { if (isRunning) requestAnimationFrame(gameLoop); }
        function winGame() { isRunning = false; clearInterval(spawnTimer); document.querySelectorAll('.item').forEach(e => e.remove()); gameScreen.style.display = 'none'; document.getElementById('win-screen').style.display = 'flex'; setInterval(createFlower, 300); }

        /* --- LOGIC TỎ TÌNH & SLIDESHOW --- */
        const btnNo = document.getElementById('btnNo');
        const btnYes = document.getElementById('btnYes');
        const card = document.querySelector('.card');
        const questionArea = document.getElementById('question-area');
        const finalMsg = document.getElementById('final-msg');
        let scale = 1; let noClickCount = 0;

        function jumpBtn() {
            const maxX = window.innerWidth - btnNo.offsetWidth - 20;
            const maxY = window.innerHeight - btnNo.offsetHeight - 20;
            btnNo.style.position = 'fixed'; btnNo.style.left = Math.random() * maxX + 'px'; btnNo.style.top = Math.random() * maxY + 'px'; btnNo.style.transform = 'none';
        }
        btnNo.addEventListener('mouseover', () => { if (noClickCount >= 1) jumpBtn(); });
        btnNo.addEventListener('touchstart', (e) => { if (noClickCount >= 1) { e.preventDefault(); jumpBtn(); } });
        btnNo.addEventListener('click', (e) => { noClickCount++; scale += 0.3; btnYes.style.transform = `translateX(-50%) scale(${scale})`; const txt = ["Hong á?", "Kì zậy?", "Đừng mà :(", "Bấm bên kia!"]; if (noClickCount < 4) btnNo.innerText = txt[noClickCount]; if (noClickCount >= 1) jumpBtn(); });

        // --- XỬ LÝ KHI BẤM ĐỒNG Ý ---
        let slideIndex = 0;
        let slideInterval;

        // Hàm chạy slideshow
        function showSlides() {
            let i;
            let slides = document.getElementsByClassName("mySlides");
            // Ẩn tất cả các slide
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";  
            }
            // Tăng chỉ số slide
            slideIndex++;
            // Nếu vượt quá số lượng ảnh thì quay về ảnh đầu tiên
            if (slideIndex > slides.length) {slideIndex = 1}    
            // Hiện slide hiện tại
            slides[slideIndex-1].style.display = "block";  
        }

        btnYes.addEventListener('click', () => {
            // Ẩn phần câu hỏi
            questionArea.style.display = 'none';
            // Hiện phần slideshow
            finalMsg.style.display = 'block';
            
            // Bắt đầu chạy slideshow ngay lập tức
            showSlides();
            // Cài đặt tự động chuyển sau mỗi 3 giây (3000ms)
            slideInterval = setInterval(showSlides, 3000);

            // Bắn tim/hoa nhiều hơn
            for(let i=0; i<50; i++) setTimeout(createFlower, i*80);
        });

        function createFlower() {
            const f = document.createElement('div');
            f.innerText = Math.random() > 0.5 ? '🌸' : '❤️';
            f.classList.add('flower-bg');
            f.style.left = Math.random() * 100 + 'vw';
            f.style.animationDuration = Math.random() * 3 + 2 + 's';
            document.body.appendChild(f);
            setTimeout(() => f.remove(), 5000);
        }