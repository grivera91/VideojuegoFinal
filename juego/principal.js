var SCREEN_WIDTH = 550 * 1.5;
var SCREEN_HEIGHT = 550 * 1.5;

var fondoJuego;
var nave;
var cursores;

var balas1, balas2, balas3, balas4;
var tiempoBala = 0;
var botonDisparo;
var ataqueEspecial;
var botonAtaqueEspecial;
var ataqueEspecial2;
var botonAtaqueEspecial2;
var ataqueEspecial3;
var botonAtaqueEspecial3;
var ataqueEspecial4;
var botonAtaqueEspecial4;

var balasEnemigas;
var balasEspeciales;
var tiempoBalaEnemiga = 0;

var vidas;
var txtVidas;
var puntaje;
var txtPuntaje;
var enemigosDerribados;

var enemigos;
var malos;
var explosionEmitter;
var explosionEspecial2;
var explosionEspecial4;

var armaDoble; // Nuevo sprite de armaDoble
var tieneArmaDoble = false; // Variable para verificar si la nave tiene el arma doble

var juego = new Phaser.Game(SCREEN_WIDTH, SCREEN_HEIGHT, Phaser.CANVAS, 'bloque_juego');

var textoInstrucciones;

var estadoInicio = {
    preload: function () {
        juego.load.image('boton', 'img/btn.png');
        juego.load.image('fondo', 'img/fondoInicio.jpg');
        juego.load.image('logoUtp', 'img/logoUtp.png');

        juego.load.audio('inicioSonido', 'sounds/inicioSonido.mp3');
        juego.load.audio('inicioPresionarBoton', 'sounds/inicioPresionarBoton.mp3');
    },

    create: function () {
        var fondo = juego.add.sprite(0, 0, 'fondo');       
        
        // Obtener las proporciones de la imagen y de la pantalla
        var escalaX = SCREEN_WIDTH / fondo.width;
        var escalaY = SCREEN_HEIGHT / fondo.height;
        
        // Escoger la escala mayor para asegurarse de que la imagen cubra toda la pantalla
        var escala = Math.max(escalaX, escalaY);
        
        fondo.scale.setTo(escala, escala);
        
        // Centrar la imagen en la pantalla
        fondo.anchor.setTo(0.5, 0.5);
        fondo.x = juego.world.centerX;
        fondo.y = juego.world.centerY;        
    
        var estiloNombre = { font: "20px Arial", fill:  " #1c47f3 " , align: "center" };
        var estiloTexto = { font: "20px Arial", fill: "#33ff42", align: "center" };
        
        var texto = juego.add.text(juego.world.centerX, juego.world.centerY + 370, "Iniciar juego", estiloTexto);

        var textoCurso = juego.add.text(juego.world.centerX, juego.world.centerY - 240, "AsignaturaDiseño y Desarrollo de Juegos Interactivos I - 30453", estiloNombre);
        var textoProfesor = juego.add.text(juego.world.centerX, juego.world.centerY - 210, "Profesor: David William Cota Sencara", estiloNombre);
        var textoProyecto = juego.add.text(juego.world.centerX, juego.world.centerY - 180, "Proyecto: Videjojuego controlado por voz", estiloNombre);
        var nombre = juego.add.text(juego.world.centerX, juego.world.centerY - 150, "Gianmarco Rivera Carhuapoma", estiloNombre);

        nombre.anchor.setTo(0.5, 0.5);
        texto.anchor.setTo(0.5, 0.5);

        textoCurso.anchor.setTo(0.5, 0.5);
        textoProfesor.anchor.setTo(0.5, 0.5);
        textoProyecto.anchor.setTo(0.5, 0.5);        
    
        var boton = juego.add.button(juego.world.centerX, juego.world.centerY+300, 'boton', this.mostrarSeleccionNave, this);
        boton.anchor.setTo(0.5, 0.5);
        this.botonIniciar = boton;

        var logoUtp = juego.add.button(juego.world.centerX, juego.world.centerY-320, 'logoUtp', this.mostrarSeleccionNave, this);
        logoUtp.anchor.setTo(0.5, 0.5);        

        this.inicioSonido = juego.add.audio('inicioSonido');
        this.inicioPresionarBoton = juego.add.audio('inicioPresionarBoton');
        juego.time.events.add(Phaser.Timer.SECOND * 0.5, this.reproducirSonido, this); 

        this.executeVoiceCommand();
    },
    
    reproducirSonido: function () {
        if (this.inicioSonido && !this.inicioSonido.isPlaying) {
            this.inicioSonido.loop = true;
            this.inicioSonido.play();
        }
    },

    executeVoiceCommand: function(command) {
        if (command === 'iniciar juego') {
            this.botonIniciar.onInputUp.dispatch();
        }
    },

    mostrarSeleccionNave: function () {

        if (this.inicioSonido.isPlaying) {
            this.inicioSonido.stop();
        }   

        // Reproducir el sonido de presionar el botón
        this.inicioPresionarBoton.play();
        
        juego.state.start('seleccionNave');
    }
};

var estadoSeleccionNave = {
    preload: function () {
        // Cargar imágenes de las naves
        juego.load.image('nave_azul', 'img/nave_azul.png');
        juego.load.image('nave_blanca', 'img/nave_blanca.png');
        juego.load.image('nave_celeste', 'img/nave_celeste.png');
        juego.load.image('nave_gris', 'img/nave_gris.png');
        juego.load.image('nave_negra_tactica', 'img/nave_negra_tactica.png');
        juego.load.image('nave_turquesa', 'img/nave_turquesa.png');
        juego.load.image('nave_verde', 'img/nave_verde.png');
        juego.load.image('fondoSeleccion', 'img/fondoSeleccion.jpg');

        juego.load.audio('esperaSeleccionPersonaje', 'sounds/esperaSeleccionPersonaje.mp3');
    },

    create: function () {
        // Agregar el fondo
        var fondo = juego.add.sprite(0, 0, 'fondoSeleccion');
        
        fondo.alpha = 0.5; // Establece la opacidad al 50%

        // Ajustar el tamaño del fondo si es necesario
        fondo.width = juego.width;
        fondo.height = juego.height

        juego.add.text(juego.world.centerX, 50, 'Selecciona tu nave', { font: '24px Arial', fill: '#0ddfd8' }).anchor.set(0.5);

        // Crear botones para cada nave y guardar referencias
        this.boton1 = juego.add.button(juego.world.centerX, 120, 'nave_azul', function() { this.seleccionarNave('nave_azul'); }, this);
        this.boton2 = juego.add.button(juego.world.centerX, 220, 'nave_blanca', function() { this.seleccionarNave('nave_blanca'); }, this);
        this.boton3 = juego.add.button(juego.world.centerX, 320, 'nave_celeste', function() { this.seleccionarNave('nave_celeste'); }, this);
        this.boton4 = juego.add.button(juego.world.centerX, 420, 'nave_gris', function() { this.seleccionarNave('nave_gris'); }, this);
        this.boton5 = juego.add.button(juego.world.centerX, 520, 'nave_negra_tactica', function() { this.seleccionarNave('nave_negra_tactica'); }, this);
        this.boton6 = juego.add.button(juego.world.centerX, 620, 'nave_turquesa', function() { this.seleccionarNave('nave_turquesa'); }, this);
        this.boton7 = juego.add.button(juego.world.centerX, 720, 'nave_verde', function() { this.seleccionarNave('nave_verde'); }, this);

        // Configuración de la escala de los botones
        var naves = [this.boton1, this.boton2, this.boton3, this.boton4, this.boton5, this.boton6, this.boton7];
        naves.forEach(function(btn) {
            btn.scale.setTo(0.3, 0.3);
            btn.anchor.set(0.5);
        });

        var colorLetras = '#18f529'
        // Crear etiquetas de texto para cada nave
        juego.add.text(this.boton1.x + 150, this.boton1.y, 'Azul', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton2.x + 150, this.boton2.y, 'Blanca', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton3.x + 150, this.boton3.y, 'Celeste', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton4.x + 150, this.boton4.y, 'Gris', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton5.x + 150, this.boton5.y, 'Negra Táctica', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton6.x + 150, this.boton6.y, 'Turquesa', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);
        juego.add.text(this.boton7.x + 150, this.boton7.y, 'Verde', { font: '18px Arial', fill: colorLetras }).anchor.set(0.5);

        this.esperaSeleccionPersonaje = juego.add.audio('esperaSeleccionPersonaje');
        juego.time.events.add(Phaser.Timer.SECOND * 0.5, this.reproducirSonido, this);   
        this.executeVoiceCommand();
        
    },

    reproducirSonido: function () {
        if (this.esperaSeleccionPersonaje && !this.esperaSeleccionPersonaje.isPlaying) {
            this.esperaSeleccionPersonaje.loop = true;
            this.esperaSeleccionPersonaje.play();
        }
    },

    seleccionarNave: function(naveSeleccionada) {
        // Guardar la selección de la nave
        this.esperaSeleccionPersonaje.stop();
        juego.naveSeleccionada = naveSeleccionada;
        juego.state.start('principal');
    },

    executeVoiceCommand: function(command) {        

        var self = this;

        if (command === 'seleccionar azul') {                    
            self.boton1.onInputUp.dispatch();
        } else if (command === 'seleccionar blanca' || command === 'seleccionar blanco' || command === 'seleccionar nave blanca' || command === 'seleccionar nave blanco') {
            self.boton2.onInputUp.dispatch();
        } else if (command === 'seleccionar celeste' || command === 'seleccionar nave celeste') {
            self.boton3.onInputUp.dispatch();
        } else if (command === 'seleccionar gris' || command === 'seleccionar nave gris') {
            self.boton4.onInputUp.dispatch();
        } else if (command === 'seleccionar negra táctica' || command === 'seleccionar nave negra táctica') {
            self.boton5.onInputUp.dispatch();
        } else if (command === 'seleccionar turquesa' || command === 'seleccionar nave turquesa') {
            self.boton6.onInputUp.dispatch();
        } else if (command === 'seleccionar verde' || command === 'seleccionar nave verde') {
            self.boton7.onInputUp.dispatch();
        }
    }
};

var estadoPrincipal = {
    preload: function () {
        juego.load.image('fondo', 'img/space.png');
        juego.load.image('personaje', 'img/nave2.png');
        juego.load.image('laser', 'img/laser.png');
        juego.load.image('malo', 'img/enemigo.png');
        juego.load.image('laserEnemigo', 'img/laserEnemigo.png');
        juego.load.image('balaEspecial', 'img/balaEspecial.png'); // Nueva bala especial
        juego.load.image('ataqueEspecial', 'img/ataqueEspecial1.png'); // Ataque especial
        juego.load.image('ataqueEspecial2', 'img/ataqueEspecial2.png'); // Segundo ataque especial
        juego.load.image('ataqueEspecial3', 'img/ataqueEspecial3.png'); // Tercer ataque especial
        juego.load.image('ataqueEspecial4', 'img/ataqueEspecial4.png'); // Cuarto ataque especial
        juego.load.image('explosionParticle', 'img/particle.png'); // Partícula de explosión
        juego.load.image('explosionEspecial2', 'img/explosionEspecial2.png'); // Explosión especial 2
        juego.load.image('explosionEspecial4', 'img/explosionEspecial4.png'); // Explosión especial 4
        juego.load.image('armaDoble', 'img/armaDoble.png'); // Imagen del armaDoble

        juego.load.audio('disparo', 'sounds/disparo.mp3');
        juego.load.audio('explosion', 'sounds/explosion.mp3');
        juego.load.audio('juegoSonido', 'sounds/juegoSonido.mp3');        
    },

    create: function () {
        fondoJuego = juego.add.tileSprite(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT, 'fondo');
        // nave = juego.add.sprite(juego.width / 2, SCREEN_HEIGHT - 50, 'personaje');
        nave = juego.add.sprite(juego.width / 2, SCREEN_HEIGHT - 50, juego.naveSeleccionada);
        nave.anchor.setTo(0.5);
        nave.scale.setTo(0.5, 0.5);
        juego.physics.arcade.enable(nave); // Habilitar física para la nave

        cursores = juego.input.keyboard.createCursorKeys();
        botonDisparo = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        botonAtaqueEspecial = juego.input.keyboard.addKey(Phaser.Keyboard.ONE);
        botonAtaqueEspecial2 = juego.input.keyboard.addKey(Phaser.Keyboard.TWO);
        botonAtaqueEspecial3 = juego.input.keyboard.addKey(Phaser.Keyboard.THREE);
        botonAtaqueEspecial4 = juego.input.keyboard.addKey(Phaser.Keyboard.FOUR);

        balas1 = juego.add.group();
        balas1.enableBody = true;
        balas1.physicsBodyType = Phaser.Physics.ARCADE;
        balas1.createMultiple(60, 'laser');
        balas1.setAll('anchor.x', 0.5);
        balas1.setAll('anchor.y', 1);
        balas1.setAll('outOfBoundsKill', true);
        balas1.setAll('checkWorldBounds', true);
        balas1.setAll('scale.x', 0.03);
        balas1.setAll('scale.y', 0.03);   
        
        balas2 = juego.add.group();
        balas2.enableBody = true;
        balas2.physicsBodyType = Phaser.Physics.ARCADE;
        balas2.createMultiple(60, 'laser');
        balas2.setAll('anchor.x', 0.5);
        balas2.setAll('anchor.y', 1);
        balas2.setAll('outOfBoundsKill', true);
        balas2.setAll('checkWorldBounds', true);
        balas2.setAll('scale.x', 0.03);
        balas2.setAll('scale.y', 0.03);  
        
        balas3 = juego.add.group();
        balas3.enableBody = true;
        balas3.physicsBodyType = Phaser.Physics.ARCADE;
        balas3.createMultiple(60, 'laser');
        balas3.setAll('anchor.x', 0.5);
        balas3.setAll('anchor.y', 1);
        balas3.setAll('outOfBoundsKill', true);
        balas3.setAll('checkWorldBounds', true);
        balas3.setAll('scale.x', 0.03);
        balas3.setAll('scale.y', 0.03); 

        balas4 = juego.add.group();
        balas4.enableBody = true;
        balas4.physicsBodyType = Phaser.Physics.ARCADE;
        balas4.createMultiple(60, 'laser');
        balas4.setAll('anchor.x', 0.5);
        balas4.setAll('anchor.y', 1);
        balas4.setAll('outOfBoundsKill', true);
        balas4.setAll('checkWorldBounds', true);
        balas4.setAll('scale.x', 0.03);
        balas4.setAll('scale.y', 0.03); 

        ataqueEspecial = juego.add.group();
        ataqueEspecial.enableBody = true;
        ataqueEspecial.physicsBodyType = Phaser.Physics.ARCADE;
        ataqueEspecial.createMultiple(1, 'ataqueEspecial');
        ataqueEspecial.setAll('anchor.x', 0.5);
        ataqueEspecial.setAll('anchor.y', 1);
        ataqueEspecial.setAll('outOfBoundsKill', true);
        ataqueEspecial.setAll('checkWorldBounds', true);
        ataqueEspecial.setAll('scale.x', 1.5); // Ajustar la escala en x
        ataqueEspecial.setAll('scale.y', 1.5); // Ajustar la escala en y

        ataqueEspecial2 = juego.add.group();
        ataqueEspecial2.enableBody = true;
        ataqueEspecial2.physicsBodyType = Phaser.Physics.ARCADE;
        ataqueEspecial2.createMultiple(1, 'ataqueEspecial2');
        ataqueEspecial2.setAll('anchor.x', 0.5);
        ataqueEspecial2.setAll('anchor.y', 1);
        ataqueEspecial2.setAll('outOfBoundsKill', true);
        ataqueEspecial2.setAll('checkWorldBounds', true);
        ataqueEspecial2.setAll('scale.x', 0.05); // Ajustar la escala en x
        ataqueEspecial2.setAll('scale.y', 0.05); // Ajustar la escala en y

        ataqueEspecial3 = juego.add.group();
        ataqueEspecial3.enableBody = true;
        ataqueEspecial3.physicsBodyType = Phaser.Physics.ARCADE;
        ataqueEspecial3.createMultiple(20, 'ataqueEspecial3');
        ataqueEspecial3.setAll('anchor.x', 0.5);
        ataqueEspecial3.setAll('anchor.y', 1);
        ataqueEspecial3.setAll('outOfBoundsKill', true);
        ataqueEspecial3.setAll('checkWorldBounds', true);
        ataqueEspecial3.setAll('scale.x', 0.015); // Ajustar la escala en x
        ataqueEspecial3.setAll('scale.y', 0.015); // Ajustar la escala en y

        ataqueEspecial4 = juego.add.group();
        ataqueEspecial4.enableBody = true;
        ataqueEspecial4.physicsBodyType = Phaser.Physics.ARCADE;
        ataqueEspecial4.createMultiple(1, 'ataqueEspecial4');
        ataqueEspecial4.setAll('anchor.x', 0.5);
        ataqueEspecial4.setAll('anchor.y', 1);
        ataqueEspecial4.setAll('outOfBoundsKill', true);
        ataqueEspecial4.setAll('checkWorldBounds', true);
        ataqueEspecial4.setAll('scale.x', 0.1); // Ajustar la escala en x
        ataqueEspecial4.setAll('scale.y', 0.1); // Ajustar la escala en y

        balasEnemigas = juego.add.group();
        balasEnemigas.enableBody = true;
        balasEnemigas.physicsBodyType = Phaser.Physics.ARCADE;
        balasEnemigas.createMultiple(20, 'laserEnemigo');
        balasEnemigas.setAll('anchor.x', 0.5);
        balasEnemigas.setAll('anchor.y', 1);
        balasEnemigas.setAll('outOfBoundsKill', true);
        balasEnemigas.setAll('checkWorldBounds', true);
        balasEnemigas.setAll('scale.x', 0.05); // Ajustar la escala en x
        balasEnemigas.setAll('scale.y', 0.05); // Ajustar la escala en y

        balasEspeciales = juego.add.group();
        balasEspeciales.enableBody = true;
        balasEspeciales.physicsBodyType = Phaser.Physics.ARCADE;
        balasEspeciales.createMultiple(10, 'balaEspecial');
        balasEspeciales.setAll('anchor.x', 0.5);
        balasEspeciales.setAll('anchor.y', 1);
        balasEspeciales.setAll('outOfBoundsKill', true);
        balasEspeciales.setAll('checkWorldBounds', true);
        balasEspeciales.setAll('scale.x', 0.05); // Ajustar la escala en x
        balasEspeciales.setAll('scale.y', 0.05); // Ajustar la escala en y

        malos = juego.add.group();
        malos.enableBody = true;
        malos.physicsBodyType = Phaser.Physics.ARCADE;
        malos.createMultiple(5, 'malo');
        malos.setAll('anchor.x', 0.5);
        malos.setAll('anchor.y', 1); // Ajustar el anclaje al centro inferior
        malos.setAll('checkWorldBounds', true);
        malos.setAll('outOfBoundsKill', true);

        malos.setAll('scale.x', 0.1); // Ajusta el valor según lo necesites
        malos.setAll('scale.y', 0.1);

        timer = juego.time.events.loop(3000, this.crearEnemigo, this);

        disparoSonido = juego.add.audio('disparo');
        explosionSonido = juego.add.audio('explosion');

        // Configurar el emisor de partículas para explosiones
        explosionEmitter = juego.add.emitter(0, 0, 100);
        explosionEmitter.makeParticles('explosionParticle');
        explosionEmitter.gravity = 200;
        explosionEmitter.setAlpha(1, 0, 1000);
        explosionEmitter.setScale(0.05, 0.02, 0.05, 0.02, 1000); // Ajustar tamaño de la partícula (mínimo, máximo, duración)

        // Crear grupo para explosión especial 2
        explosionEspecial2 = juego.add.group();
        explosionEspecial2.enableBody = true;
        explosionEspecial2.physicsBodyType = Phaser.Physics.ARCADE;

        // Crear grupo para explosión especial 4
        explosionEspecial4 = juego.add.group();
        explosionEspecial4.enableBody = true;
        explosionEspecial4.physicsBodyType = Phaser.Physics.ARCADE;

        vidas = 5;
        juego.add.text(SCREEN_WIDTH - 60, 20, "vidas: ", { font: "14px Arial", fill: "#FFF" });
        txtVidas = juego.add.text(SCREEN_WIDTH - 20, 20, vidas, { font: "14px Arial", fill: "#FFF" });

        // Inicializar puntaje y contador de enemigos derribados
        puntaje = 0;
        enemigosDerribados = 0;
        juego.add.text(20, 20, "Puntaje: ", { font: "14px Arial", fill: "#FFF" });
        txtPuntaje = juego.add.text(80, 20, "0", { font: "14px Arial", fill: "#FFF" }); 

        var estiloNombre = { font: "20px Arial", fill: "#ffffff", align: "center" };
        var nombre = juego.add.text(278, 812, "Gianmarco Rivera Carhuapoma", estiloNombre);
        nombre.anchor.setTo(0.5, 0.5);

        var instrucciones = "Instrucciones de voz: \nMovimiento: \nArriba/Abajo/Izquierda/Derecha \nAcciones: \nDisparar \nEspecial 1 \nEspecial 2 \nEspecial 3 \nEspecial 4";
        textoInstrucciones = juego.add.text(5,630,instrucciones,{ font: "12px Arial", fill: "#FFF" });

        this.executeVoiceCommand();
        
        this.aparecerArmaDoble();

        this.juegoSonido = juego.add.audio('juegoSonido');        
        
        juego.time.events.add(Phaser.Timer.SECOND * 0.5, this.reproducirSonido, this); 
    },

    executeVoiceCommand: function(command) {
        var self = this;
        if (command === 'disparar') {
            if (juego.time.now > tiempoBala) {
                var balaIzquierda1 = balas1.getFirstExists(false);
                var balaIzquierda2 = balas2.getFirstExists(false);
                var balaDerecha1 = balas3.getFirstExists(false);
                var balaDerecha2 = balas4.getFirstExists(false);

                if(tieneArmaDoble){
                    balaIzquierda1.reset(nave.x + 22, nave.y); // Desplazamiento a la derecha
                    balaIzquierda2.reset(nave.x + 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha1.reset(nave.x - 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha2.reset(nave.x - 22, nave.y);
                }else{                    
                    balaIzquierda2.reset(nave.x + 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha1.reset(nave.x - 16, nave.y); // Desplazamiento a la izquierda
                }

                balaIzquierda1.body.velocity.y = -300;
                balaIzquierda2.body.velocity.y = -300;
                balaDerecha1.body.velocity.y = -300;
                balaDerecha2.body.velocity.y = -300;  

                tiempoBala = juego.time.now + 100;  

                disparoSonido.play();
            }
        } else if (command === 'arriba') {
            nave.position.y -= 20;
        } else if (command === 'abajo') {
            nave.position.y += 20;
        } else if (command === 'izquierda') {
            nave.position.x -= 20;
        } else if (command === 'derecha') {
            nave.position.x += 20;
        } else if (command === 'especial uno' || command === 'especial 1') {
            self.dispararAtaqueEspecial();
        } else if (command === 'especial dos' || command === 'especial 2') {
            self.dispararAtaqueEspecial2();
        } else if (command === 'especial tres' || command === 'especial 3') {
            self.dispararAtaqueEspecial3();
        } else if (command === 'especial cuatro' || command === 'especial 4') {
            self.dispararAtaqueEspecial4();
        }
    },

    reproducirSonido: function () {
        if (this.juegoSonido && !this.juegoSonido.isPlaying) {
            this.juegoSonido.loop = true;
            this.juegoSonido.play();
        }
    },

    update: function () {
        fondoJuego.tilePosition.y += 2;

        if (cursores.right.isDown && nave.position.x < SCREEN_WIDTH - 30) {
            nave.position.x += 3;
        } else if (cursores.left.isDown && nave.position.x > 15) {
            nave.position.x -= 3;
        } else if (cursores.up.isDown && nave.position.y > 20) {
            nave.position.y -= 3;
        } else if (cursores.down.isDown && nave.position.y < SCREEN_HEIGHT - 30) {
            nave.position.y += 3;
        }

        if (botonDisparo.isDown) {
            if (juego.time.now > tiempoBala) {
                var balaIzquierda1 = balas1.getFirstExists(false);
                var balaIzquierda2 = balas2.getFirstExists(false);
                var balaDerecha1 = balas3.getFirstExists(false);
                var balaDerecha2 = balas4.getFirstExists(false);

                if(tieneArmaDoble){
                    balaIzquierda1.reset(nave.x + 22, nave.y); // Desplazamiento a la derecha
                    balaIzquierda2.reset(nave.x + 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha1.reset(nave.x - 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha2.reset(nave.x - 22, nave.y);
                }else{                    
                    balaIzquierda2.reset(nave.x + 16, nave.y); // Desplazamiento a la izquierda
                    balaDerecha1.reset(nave.x - 16, nave.y); // Desplazamiento a la izquierda
                }

                balaIzquierda1.body.velocity.y = -300;
                balaIzquierda2.body.velocity.y = -300;
                balaDerecha1.body.velocity.y = -300;
                balaDerecha2.body.velocity.y = -300;  

                tiempoBala = juego.time.now + 100;  

                disparoSonido.play();
            }
        }

        if (botonAtaqueEspecial.isDown) {
            this.dispararAtaqueEspecial();
        }

        if (botonAtaqueEspecial2.isDown) {
            this.dispararAtaqueEspecial2();
        }

        if (botonAtaqueEspecial3.isDown) {
            this.dispararAtaqueEspecial3();
        }

        if (botonAtaqueEspecial4.isDown) {
            this.dispararAtaqueEspecial4();
        }

        juego.physics.arcade.overlap(balas1, malos, colisionBalaEnemigo, null, this);
        juego.physics.arcade.overlap(balas2, malos, colisionBalaEnemigo, null, this);
        juego.physics.arcade.overlap(balas3, malos, colisionBalaEnemigo, null, this);
        juego.physics.arcade.overlap(balas4, malos, colisionBalaEnemigo, null, this);
        juego.physics.arcade.overlap(malos, nave, colisionEnemigoNave, null, this);
        juego.physics.arcade.overlap(balasEnemigas, nave, colisionBalaEnemigoNave, null, this);
        juego.physics.arcade.overlap(balasEspeciales, nave, colisionBalaEnemigoNave, null, this);
        juego.physics.arcade.overlap(ataqueEspecial, malos, colisionAtaqueEspecialEnemigo, null, this);
        juego.physics.arcade.overlap(ataqueEspecial, balasEnemigas, colisionAtaqueEspecialBala, null, this);
        juego.physics.arcade.overlap(ataqueEspecial, balasEspeciales, colisionAtaqueEspecialBala, null, this);
        juego.physics.arcade.overlap(balas1, balasEnemigas, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas2, balasEnemigas, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas3, balasEnemigas, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas4, balasEnemigas, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas1, balasEspeciales, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas2, balasEspeciales, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas3, balasEspeciales, colisionBalas, null, this);
        juego.physics.arcade.overlap(balas4, balasEspeciales, colisionBalas, null, this);
        juego.physics.arcade.overlap(explosionEspecial2, malos, colisionExplosionEspecialEnemigo, null, this);
        juego.physics.arcade.overlap(explosionEspecial2, balasEnemigas, colisionExplosionEspecialBala, null, this);
        juego.physics.arcade.overlap(explosionEspecial2, balasEspeciales, colisionExplosionEspecialBala, null, this);
        juego.physics.arcade.overlap(ataqueEspecial3, malos, colisionAtaqueEspecial3Enemigo, null, this);
        juego.physics.arcade.overlap(ataqueEspecial3, balasEnemigas, colisionAtaqueEspecial3Bala, null, this);
        juego.physics.arcade.overlap(ataqueEspecial3, balasEspeciales, colisionAtaqueEspecial3Bala, null, this);        

        balasEspeciales.forEachAlive(this.actualizarDireccionBalaEspecial, this);
        explosionEspecial4.forEachAlive(this.atraccionExplosionEspecial4, this);

        if (juego.time.now > tiempoBalaEnemiga) {
            this.enemigosDisparan();
            tiempoBalaEnemiga = juego.time.now + Math.random() * 2000; // Disparos aleatorios entre 0 y 2 segundos
        }

        if (vidas <= 0) {
            this.juegoFinalizado();
        }

        if (armaDoble && juego.physics.arcade.overlap(nave, armaDoble, this.recogerArmaDoble, null, this)) {
            // La función de colisión y recogida se maneja aquí
            juego.physics.arcade.collide(nave, armaDoble, this.recogerArmaDoble, null, this);
        }
    },

    crearEnemigo: function () {
        var enem = malos.getFirstDead();
        if (enem) {
            var num = Math.floor(Math.random() * (SCREEN_WIDTH - 40) + 20); // Generar enemigo dentro de los límites de la pantalla
            enem.reset(num, 0);
            enem.anchor.setTo(0.5, 1); // Ajustar el anclaje al centro inferior
            enem.body.velocity.y = 20;
            enem.checkWorldBounds = true;
            enem.outOfBoundsKill = true;
        }
    },

    enemigosDisparan: function () {
        malos.forEachAlive(function (enem) {
            if (enem.y <= SCREEN_HEIGHT / 2) {
                if (Math.random() < 0.2) { // 40% de probabilidad de disparar bala normal
                    var balaEnem = balasEnemigas.getFirstExists(false);
                    if (balaEnem) {
                        balaEnem.reset(enem.x, enem.y + enem.height); // Disparo sale justo debajo del enemigo
                        juego.physics.arcade.moveToObject(balaEnem, nave, 50); // Mueve la bala hacia la nave a velocidad 200
                    }
                } else if (Math.random() < 0.15) { // 20% de probabilidad de disparar bala especial
                    var balaEsp = balasEspeciales.getFirstExists(false);
                    if (balaEsp) {
                        balaEsp.reset(enem.x, enem.y + enem.height); // Disparo sale justo debajo del enemigo
                        juego.physics.arcade.moveToObject(balaEsp, nave, 100    ); // Velocidad doble de la bala especial
                    }
                }
            }
        });
    },

    dispararAtaqueBasico: function () {
        var ataque = ataqueEspecial.getFirstExists(false);
        if (ataque) {
            ataque.reset(nave.x, nave.y);
            ataque.body.velocity.y = -400;
        }
    },

    dispararAtaqueEspecial: function () {
        var ataque = ataqueEspecial.getFirstExists(false);
        if (ataque) {
            ataque.reset(nave.x, nave.y);
            ataque.body.velocity.y = -400;
        }
    },

    dispararAtaqueEspecial2: function () {
        var ataque2 = ataqueEspecial2.getFirstExists(false);
        if (ataque2) {
            ataque2.reset(nave.x, nave.y);
            ataque2.body.velocity.y = -250;
            juego.time.events.add(Phaser.Timer.SECOND * 2, function () {
                ataque2.kill();
                this.crearExplosionEspecial2(ataque2.x, ataque2.y);
            }, this);
        }
    },

    dispararAtaqueEspecial3: function () {
        for (var i = 0; i < 5; i++) {
            var ataque3 = ataqueEspecial3.getFirstExists(false);
            if (ataque3) {
                ataque3.reset(nave.x, nave.y);
                ataque3.body.velocity.y = -300;
                ataque3.body.velocity.x = (Math.random() - 0.5) * 200; // Velocidad horizontal aleatoria
            }
        }
    },

    dispararAtaqueEspecial4: function () {
        var ataque4 = ataqueEspecial4.getFirstExists(false);
        if (ataque4) {
            ataque4.reset(nave.x, nave.y);
            ataque4.body.velocity.y = -200;
    
            // Añadir rotación continua al sprite
            ataque4.rotationTween = juego.add.tween(ataque4).to({ angle: 360 }, 1000, Phaser.Easing.Linear.None, true, 0, -1);
    
            // Programar desaparición del sprite después de 2.25 segundos
            juego.time.events.add(Phaser.Timer.SECOND * 2.25, function () {
                ataque4.kill();
                this.crearExplosionEspecial4(ataque4.x, ataque4.y);
                ataque4.rotationTween.stop(); // Detener la rotación al matar el sprite
            }, this);
        }
    },

    crearExplosionEspecial2: function (x, y) {
        var explosion = explosionEspecial2.create(x, y, 'explosionEspecial2');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.scale.setTo(1.5, 1.5);
        explosion.body.angularVelocity = 200; // Girar en su eje
        
        // Añadir efecto de parpadeo
        var tween = juego.add.tween(explosion)
            .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true, 0, -1, true);

        juego.time.events.add(Phaser.Timer.SECOND * 3, function () {
            explosion.kill();
            tween.stop();
        }, this);
    },

    crearExplosionEspecial4: function (x, y) {
        var explosion = explosionEspecial4.create(x, y, 'explosionEspecial4');
        explosion.anchor.setTo(0.5, 0.5);
        explosion.scale.setTo(1.15, 1.15);
        explosion.body.angularVelocity = 250; // Girar en su eje
        
        juego.time.events.add(Phaser.Timer.SECOND * 5, function () {
            explosion.kill();
        }, this);
    },

    actualizarDireccionBalaEspecial: function (balaEsp) {
        juego.physics.arcade.moveToObject(balaEsp, nave, 400); // Actualizar dirección hacia la nave con velocidad 400
    },

    atraccionExplosionEspecial4: function (explosion) {
        var limiteDistancia = 20;
        var velocidadAtraccion = 200;
        malos.forEachAlive(function (enemigo) {
            juego.physics.arcade.moveToObject(enemigo, explosion, velocidadAtraccion); // Velocidad de atracción
            // Destruir enemigo si está cerca del centro
            if (Phaser.Math.distance(enemigo.x, enemigo.y, explosion.x, explosion.y) < limiteDistancia) {
                enemigo.kill();
                explosionSonido.play();
                showExplosion(enemigo.x, enemigo.y);
                actualizarPuntaje();
            }            
        });
        balasEnemigas.forEachAlive(function (balaEnem) {
            juego.physics.arcade.moveToObject(balaEnem, explosion, velocidadAtraccion); // Velocidad de atracción
            // Destruir bala enemiga si está cerca del centro
            if (Phaser.Math.distance(balaEnem.x, balaEnem.y, explosion.x, explosion.y) < limiteDistancia) {
                balaEnem.kill();
                explosionSonido.play();
                showExplosion(balaEnem.x, balaEnem.y);
            }
        });
        balasEspeciales.forEachAlive(function (balaEsp) {
            juego.physics.arcade.moveToObject(balaEsp, explosion, velocidadAtraccion); // Velocidad de atracción
            // Destruir bala especial si está cerca del centro
            if (Phaser.Math.distance(balaEsp.x, balaEsp.y, explosion.x, explosion.y) < limiteDistancia) {
                balaEsp.kill();
                explosionSonido.play();
                showExplosion(balaEsp.x, balaEsp.y);
            }
        });
    },

    juegoFinalizado: function () {
        nave.kill();

        if (this.juegoSonido && this.juegoSonido.isPlaying) {
            this.juegoSonido.stop();
        }
        // Mostrar mensaje de juego finalizado
        var estiloMensaje = { font: "30px Arial", fill: "#ff0044", align: "center" };
        var mensaje = juego.add.text(juego.world.centerX, juego.world.centerY, "Juego Finalizado", estiloMensaje);
        mensaje.anchor.setTo(0.5, 0.5);

        // Reiniciar el juego después de 2 segundos
        setTimeout(function () {            
            juego.state.start('principal');
        }, 2000);
    },

    aparecerArmaDoble: function () {
        if (!tieneArmaDoble && !armaDoble) {
            var tiempoAparecer = Math.random() * 10000 + 5000; // Entre 5 y 15 segundos
            juego.time.events.add(tiempoAparecer, function () {
                if (!tieneArmaDoble && !armaDoble) {
                    armaDoble = juego.add.sprite(Math.random() * (SCREEN_WIDTH - 50), Math.random() * (SCREEN_HEIGHT - 50), 'armaDoble');
                    armaDoble.anchor.setTo(0.5);
                    armaDoble.scale.setTo(0.05, 0.05);
                    juego.physics.arcade.enable(armaDoble);
                    armaDoble.body.velocity.setTo(100 + Math.random() * 200, 100 + Math.random() * 200);
                    armaDoble.body.bounce.set(1);
                    armaDoble.body.collideWorldBounds = true;
                }
            }, this);
        }
    },

    recogerArmaDoble: function (nave, arma) {
        arma.kill(); // Mata el sprite armaDoble
        tieneArmaDoble = true;
        armaDoble = null; // Asegura que armaDoble esté establecido en null
    
        this.aparecerArmaDoble(); // Llama para iniciar el temporizador para la próxima aparición
    }
};

function colisionBalaEnemigo(bala, enemigo) {
    bala.kill();
    enemigo.kill();
    explosionSonido.play();
    showExplosion(enemigo.x, enemigo.y);    
}

function colisionEnemigoNave(nave, enemigo) {
    enemigo.kill();
    explosionSonido.play();
    vidas -= 1;
    txtVidas.text = vidas;

    showExplosion(enemigo.x, enemigo.y);
    tieneArmaDoble=false;

    if (vidas <= 0) {
        juego.state.states['principal'].juegoFinalizado(); // Llamar a juegoFinalizado desde el estado principal
    }
}

function colisionBalaEnemigoNave(nave, balaEnem) {
    balaEnem.kill();
    explosionSonido.play();
    vidas -= 1;
    txtVidas.text = vidas;

    showExplosion(balaEnem.x, balaEnem.y);
    tieneArmaDoble=false;

    if (vidas <= 0) {
        juego.state.states['principal'].juegoFinalizado(); // Llamar a juegoFinalizado desde el estado principal
    }
}

function colisionBalas(bala, balaEnem) {
    bala.kill();
    balaEnem.kill();
    explosionSonido.play();
    showExplosion(bala.x, bala.y);
    actualizarPuntaje();
}

function colisionAtaqueEspecialEnemigo(ataque, enemigo) {
    enemigo.kill();
    explosionSonido.play();
    showExplosion(enemigo.x, enemigo.y);
    actualizarPuntaje();
}

function colisionAtaqueEspecialBala(ataque, balaEnem) {
    balaEnem.kill();
    explosionSonido.play();
    showExplosion(balaEnem.x, balaEnem.y);
}

function colisionExplosionEspecialEnemigo(explosion, enemigo) {
    enemigo.kill();
    explosionSonido.play();
    showExplosion(enemigo.x, enemigo.y);
    actualizarPuntaje();
}

function colisionExplosionEspecialBala(explosion, balaEnem) {
    balaEnem.kill();
    explosionSonido.play();
    showExplosion(balaEnem.x, balaEnem.y);    
}

function colisionAtaqueEspecial3Enemigo(ataque3, enemigo) {
    ataque3.kill();
    enemigo.kill();
    explosionSonido.play();
    showExplosion(enemigo.x, enemigo.y);
    actualizarPuntaje();
}

function colisionAtaqueEspecial3Bala(ataque3, balaEnem) {
    ataque3.kill();
    balaEnem.kill();
    explosionSonido.play();
    showExplosion(balaEnem.x, balaEnem.y);
    actualizarPuntaje();
}

function showExplosion(x, y) {
    explosionEmitter.x = x;
    explosionEmitter.y = y;
    explosionEmitter.start(true, 1000, null, 10);
}

function actualizarPuntaje(){
    // Incrementar puntaje y actualizar texto de puntaje
    puntaje += 10;
    txtPuntaje.text = puntaje;

    // Incrementar contador de enemigos derribados
    enemigosDerribados++;
    if (enemigosDerribados % 10 === 0 && vidas < 10) {
        vidas++;
        txtVidas.text = vidas;
    }
}

var voiceManager = {
    recognition: null,
    init: function() {
        var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            console.error("Este navegador no soporta la API de reconocimiento de voz.");
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.lang = 'es-ES';
        this.recognition.continuous = true; // Importante para multi-estado
        this.recognition.onresult = this.handleResult.bind(this);
        this.recognition.onerror = function(event) { console.error("Reconocimiento de voz error:", event.error); };
        this.recognition.start();
    },
    handleResult: function(event) {
        var command = event.results[event.resultIndex][0].transcript.toLowerCase().trim();
        console.log('Command:', command);
        this.executeCommand(command);
    },
    executeCommand: function(command) {
        var currentState = juego.state.getCurrentState();
        // Delegar a la función del estado actual
        if (currentState && typeof currentState.executeVoiceCommand === 'function') {
            currentState.executeVoiceCommand(command);
        }
    }
};

juego.state.add('inicio', estadoInicio);
juego.state.add('seleccionNave', estadoSeleccionNave);
juego.state.add('principal', estadoPrincipal);
juego.state.start('inicio');
voiceManager.init();