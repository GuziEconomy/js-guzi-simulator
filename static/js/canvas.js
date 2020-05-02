(function() {
    var total = 1000,
        blobs = new Array(total),
        myfps = 60,
        updateTime = 1000 / myfps,
        mouse_pos = { x: 0, y: 0 },
        canvas = this.__canvas = new fabric.Canvas('canvas', {
            renderOnAddRemove: false,
            selection: false
        }),
        maxx = canvas.width,
        maxy = canvas.height,
        msg, startTime, prevTime, ms, frames;

    canvas.setBackgroundImage('../assets/bkg.jpg');
    fabric.Image.fromURL('../assets/blob.png', blobLoaded);

    canvas.on('mouse:move', function(options) {
        mouse_pos = canvas.getPointer(options.e);
    });

    function blobLoaded(img) {
        for (var i = 0; i < total; i++) {
            var img2 = new fabric.Image(img.getElement(), {
                left: Math.random() * maxx,
                top: Math.random() * maxy,
                selectable: false
            });
            img2.vx = 0;
            img2.vy = 0;
            canvas.add(img2);
            blobs[i] = img2;
        }

        msg = new fabric.Text('FPS: 0/' + myfps, {
            fontFamily: 'Arial',
            fontSize: 12,
            fill: 'white',
            fontWeight: 'bold',
            left: 50,
            top: 35,
            selectable: false
        });
        canvas.add(msg);

        frames = 0;
        startTime = Date.now(), prevTime = startTime;
        animate();
    }

    function animate() {
        for (var i = 0; i < total; i++) {
            var blob = blobs[i];
            var dx = blob.left - mouse_pos.x;
            var dy = blob.top - mouse_pos.y;
            var vx = blob.vx;
            var vy = blob.vy;

            if (dx * dx + dy * dy <= 10000) {
                vx += dx * 0.01;
                vy += dy * 0.01;
            }
            vx *= 0.95;
            vy *= 0.95;

            vx += Math.random() - 0.5;
            vy += Math.random() - 0.5;

            var x = blob.left += vx;
            var y = blob.top += vy;

            if (x < 0 || x > maxx || y < 0 || y > maxy) {
                var r = Math.atan2(y - maxy / 2, x - maxx / 2);
                vx = -Math.cos(r);
                vy = -Math.sin(r);
            }

            blob.vx = vx;
            blob.vy = vy;
        }

        var time = Date.now();
        frames++;

        if ( time > prevTime + 1000 ) {
            fps = Math.round( ( frames * 1000 ) / ( time - prevTime ) );
            prevTime = time;
            frames = 0;

            msg.set('text', "FPS: " + fps + "/" + myfps);
        }

        fabric.util.requestAnimFrame(animate, canvas.getElement());
        canvas.renderAll();
    }
})();