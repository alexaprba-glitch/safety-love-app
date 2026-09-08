document.addEventListener('DOMContentLoaded', () => {
    // Number counter animation
    const counters = document.querySelectorAll('.counter');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target'));
                const duration = 2000; // ms
                const frameRate = 1000 / 60; // 60fps
                const totalFrames = Math.round(duration / frameRate);
                let currentFrame = 0;

                const counterInterval = setInterval(() => {
                    currentFrame++;
                    const progress = currentFrame / totalFrames;
                    const currentCount = Math.round(endValue * easeOutQuart(progress));
                    
                    target.innerText = currentCount.toLocaleString();

                    if (currentFrame === totalFrames) {
                        clearInterval(counterInterval);
                        target.innerText = endValue.toLocaleString();
                    }
                }, frameRate);
                
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));

    // Easing function for smooth counting
    function easeOutQuart(x) {
        return 1 - Math.pow(1 - x, 4);
    }

    // Button interaction
    const launchBtn = document.getElementById('launch-app-btn');
    if(launchBtn) {
        launchBtn.addEventListener('click', () => {
            launchBtn.innerText = 'Connecting...';
            launchBtn.style.background = '#22c55e';
            launchBtn.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
            
            setTimeout(() => {
                alert('Welcome to Safety Love Secure Dashboard!');
                launchBtn.innerText = 'Dashboard Active';
            }, 1500);
        });
    }
});
