document.addEventListener('DOMContentLoaded', () => {
    // --- ELEMENTOS Y LÓGICA PARA NÚMERO DE VIDA ---
    const diaInput = document.getElementById('dia');
    const mesInput = document.getElementById('mes');
    const anoInput = document.getElementById('ano');
    const calcularBtnVida = document.getElementById('btnCalcularVida'); // Renombrado para claridad
    const resultadoDivVida = document.getElementById('resultadoVida'); // Renombrado para claridad

    // --- ELEMENTOS Y LÓGICA PARA NÚMERO DE DESTINO ---
    const nombreInputDestino = document.getElementById('nombre');
    const calcularBtnDestino = document.getElementById('btnCalcularDestino');
    const resultadoDivDestino = document.getElementById('resultadoDestino');

    // Objeto con los significados (común para ambos, pero el título del resultado cambiará)
    const significadosNumeros = {
        1: {
            tituloBase: "El Líder Innovador",
            descripcion: "Representa la independencia, la originalidad y el liderazgo. Eres pionero, con una fuerte voluntad y determinación. Tu camino es el de la autoafirmación y la creación."
        },
        2: {
            tituloBase: "El Cooperador Diplomático",
            descripcion: "Simboliza la cooperación, la diplomacia, la sensibilidad y la armonía. Buscas el equilibrio y trabajas bien en equipo. Tu camino es el de las relaciones y la paciencia."
        },
        3: {
            tituloBase: "El Comunicador Creativo",
            descripcion: "Es el número de la expresión, la creatividad y el optimismo. Tienes un don para la comunicación y disfrutas de la vida social. Tu camino es el de la autoexpresión y la alegría."
        },
        4: {
            tituloBase: "El Constructor Estable",
            descripcion: "Representa la estabilidad, el orden, el trabajo duro y la practicidad. Eres disciplinado y confiable. Tu camino es el de la construcción de bases sólidas y la perseverancia."
        },
        5: {
            tituloBase: "El Aventurero Versátil",
            descripcion: "Simboliza la libertad, la aventura, el cambio y la versatilidad. Eres curioso y te adaptas fácilmente. Tu camino es el de la experiencia, la libertad y la expansión."
        },
        6: {
            tituloBase: "El Cuidador Responsable",
            descripcion: "Es el número de la responsabilidad, el amor, la familia y el servicio. Eres compasivo y buscas la armonía. Tu camino es el del cuidado de los demás y la búsqueda de la belleza."
        },
        7: {
            tituloBase: "El Buscador Espiritual",
            descripcion: "Representa la introspección, la sabiduría, el análisis y la espiritualidad. Eres intuitivo y buscas el conocimiento profundo. Tu camino es el de la fe y la conexión interior."
        },
        8: {
            tituloBase: "El Poder Material",
            descripcion: "Simboliza el poder, la ambición material, el éxito y la autoridad. Tienes una gran capacidad de gestión y liderazgo. Tu camino es el del logro, la abundancia y el equilibrio kármico."
        },
        9: {
            tituloBase: "El Humanitario Compasivo",
            descripcion: "Es el número del humanitarismo, la compasión, la finalización y el idealismo. Eres generoso y tienes una visión universal. Tu camino es el del servicio desinteresado y la sabiduría."
        },
        11: {
            tituloBase: "El Idealista Inspirado (Maestro)",
            descripcion: "Posee una intuición elevada, inspiración y una conexión directa con lo espiritual. Eres un visionario. Tu camino es el de la iluminación y la guía, pero debes cuidar tu sistema nervioso."
        },
        22: {
            tituloBase: "El Constructor Maestro (Maestro)",
            descripcion: "Combina la visión del 11 con la practicidad del 4. Tienes la capacidad de convertir grandes sueños en realidad. Tu camino es el de la manifestación a gran escala para el bien común."
        },
        33: {
            tituloBase: "El Maestro del Amor Compasivo (Maestro)",
            descripcion: "Es el 'Maestro Sanador', con una profunda compasión universal y un llamado al servicio desinteresado. Tu camino es el de la elevación de la conciencia y el sacrificio gozoso. (Es menos común como Número final)."
        }
    };

    // Función de reducción general (para números de vida, destino, etc.)
    // Reduce un número a un solo dígito o a un número maestro (11, 22, 33)
    function reducirNumeroMaestro(num) {
        let numero = parseInt(num, 10);
        if (isNaN(numero)) return 0; // Manejar caso de no ser número

        if (numero === 11 || numero === 22 || numero === 33) {
            return numero;
        }
        while (numero > 9) {
            let sumaDigitos = 0;
            const digitosComoString = numero.toString().split('');
            for (const digito of digitosComoString) {
                sumaDigitos += parseInt(digito, 10);
            }
            numero = sumaDigitos;
            if (numero === 11 || numero === 22 || numero === 33) {
                return numero;
            }
        }
        return numero;
    }

    // --- LÓGICA PARA NÚMERO DE VIDA ---
    if (calcularBtnVida) {
        calcularBtnVida.addEventListener('click', () => {
            const dia = parseInt(diaInput.value, 10);
            const mes = parseInt(mesInput.value, 10);
            const ano = parseInt(anoInput.value, 10);

            if (isNaN(dia) || isNaN(mes) || isNaN(ano) || dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1000 || ano > 9999) {
                resultadoDivVida.innerHTML = `<p style="color: red;">Por favor, ingresa una fecha de nacimiento válida.</p>`;
                return;
            }

            const diaReducido = reducirNumeroMaestro(dia);
            const mesReducido = reducirNumeroMaestro(mes);
            
            const anoString = ano.toString();
            let sumaDigitosAno = 0;
            for (let i = 0; i < anoString.length; i++) {
                sumaDigitosAno += parseInt(anoString[i], 10);
            }
            const anoReducido = reducirNumeroMaestro(sumaDigitosAno);

            const sumaTotal = diaReducido + mesReducido + anoReducido;
            const numeroVida = reducirNumeroMaestro(sumaTotal);

            const significado = significadosNumeros[numeroVida];
            if (significado) {
                resultadoDivVida.innerHTML = `
                    <h3>Tu Número de la Vida es: <span style="color: #6A1B9A;">${numeroVida}</span></h3>
                    <h4>${significado.tituloBase.replace("(Maestro)", "")}</h4>
                    <p>${significado.descripcion}</p>
                    <p><em>Para una interpretación más profunda, visita nuestra sección de <a href="significados.html" class="inline-link">Significados de los Números</a>.</em></p>
                `;
            } else {
                resultadoDivVida.innerHTML = `<p>Número de Vida calculado: ${numeroVida}. Significado no encontrado.</p>`;
            }
        });
    }

    // --- LÓGICA PARA NÚMERO DE DESTINO ---
    const tablaPitagorica = {
        'a': 1, 'j': 1, 's': 1,
        'b': 2, 'k': 2, 't': 2,
        'c': 3, 'l': 3, 'u': 3,
        'd': 4, 'm': 4, 'v': 4,
        'e': 5, 'n': 5, 'w': 5, 'ñ': 5, // Asignamos ñ a 5
        'f': 6, 'o': 6, 'x': 6,
        'g': 7, 'p': 7, 'y': 7,
        'h': 8, 'q': 8, 'z': 8,
        'i': 9, 'r': 9
    };

    if (calcularBtnDestino) {
        calcularBtnDestino.addEventListener('click', () => {
            const nombreCompleto = nombreInputDestino.value.toLowerCase(); // Convertir a minúsculas
            
            if (!nombreCompleto.trim()) {
                resultadoDivDestino.innerHTML = `<p style="color: red;">Por favor, ingresa un nombre.</p>`;
                return;
            }

            let sumaNombre = 0;
            for (let i = 0; i < nombreCompleto.length; i++) {
                const letra = nombreCompleto[i];
                if (tablaPitagorica[letra]) { // Solo sumar si la letra está en la tabla (ignora espacios, números, etc.)
                    sumaNombre += tablaPitagorica[letra];
                }
            }

            const numeroDestino = reducirNumeroMaestro(sumaNombre);
            const significado = significadosNumeros[numeroDestino];

            if (significado) {
                resultadoDivDestino.innerHTML = `
                    <h3>Tu Número de Destino es: <span style="color: #6A1B9A;">${numeroDestino}</span></h3>
                    <h4>${significado.tituloBase.replace("(Maestro)", "")}</h4>
                    <p>${significado.descripcion}</p>
                    <p><em>Para una interpretación más profunda, visita nuestra sección de <a href="significados.html" class="inline-link">Significados de los Números</a>.</em></p>
                `;
            } else {
                resultadoDivDestino.innerHTML = `<p>Número de Destino calculado: ${numeroDestino}. Significado no encontrado.</p>`;
            }
        });
    }
});
