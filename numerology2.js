document.addEventListener('DOMContentLoaded', () => {
    // --- INICIO: LÓGICA PARA NUMEROLOGÍA OMKIN-KAY ---

    // Selectores de elementos del DOM para la página omkin-kay.html
    const diaInputOK = document.getElementById('diaNacimientoOK');
    const mesInputOK = document.getElementById('mesNacimientoOK');
    const anoInputOK = document.getElementById('anoNacimientoOK');
    const calcularBtnOK = document.getElementById('btnCalcularOmkinKay');
    
    // Spans para mostrar los números calculados
    const numeroEsenciaOKSpan = document.getElementById('numeroEsenciaOK');
    const numeroPersonalidadOKSpan = document.getElementById('numeroPersonalidadOK');
    const numeroRegaloOKSpan = document.getElementById('numeroRegaloOK');
    const numeroVidasPasadasOKSpan = document.getElementById('numeroVidasPasadasOK');
    const numeroMisionOKSpan = document.getElementById('numeroMisionOK');

    // Párrafos para mostrar los significados
    const significadoEsenciaOKP = document.getElementById('significadoEsenciaOK');
    const significadoPersonalidadOKP = document.getElementById('significadoPersonalidadOK');
    const significadoRegaloOKP = document.getElementById('significadoRegaloOK');
    const significadoVidasPasadasOKP = document.getElementById('significadoVidasPasadasOK');
    const significadoMisionOKP = document.getElementById('significadoMisionOK');
    const textoCoincidenciasOKP = document.getElementById('textoCoincidenciasOK');

    // Estructura para significados Omkin-Kay (basado en el PDF)
    // DEBERÁS COMPLETAR ESTA SECCIÓN CON LOS TEXTOS DEL PDF
    const significadosOmkinKay = {
        esencia_personalidad: {
            1: "Palabra Clave: Bondad. Humildes, viven con el corazón, suaves, auténticos, amorosos, creativos...",
            2: "Palabra Clave: Obediencia. Discípulo por excelencia, les encanta aprender de una sola Fuente, gentiles...",
            3: "Palabra Clave: Positividad. Optimistas, encantadores, sociables, simpáticas, sumamente positivas...",
            4: "Palabra Clave: Inteligencia. Perseverantes, tenaces, decididas, serviciales, incomprendidos...",
            5: "Palabra Clave: Disciplina. Hermosas interna y externamente, encantadoras, atractivos, corteses...",
            6: "Palabra Clave: Misticismo. Amor a Dios, fe inquebrantable, intuitivos, perspicaces, protección divina...",
            7: "Palabra Clave: Liderazgo. Poder del verbo, convence, inspirador natural, intensos, misericordia...",
            8: "Palabra Clave: PUREZA. Transparentes, auténticos, honestos, limpios, sanan el entorno...",
            9: "Palabra Clave: Realización. Alcanzar máxima proyección en todos los niveles, profundos en el amor...",
            10: "Palabra Clave: Totalidad. Todo o nada, perfección, fuerza interna y externa, grandes maestros...",
            11: "Palabra Clave: SÚPERCONCIENCIA. Conexión, realización, percepción, totalidad, uno con el todo..."
            // Asegúrate de que los textos sean extractos fieles o resúmenes precisos del PDF.
        },
        mision: {
            1: "Aprender a tomar iniciativas, ser 'humildes y mansos de corazón', desarrollar la originalidad, la bondad...",
            2: "Aprender a colaborar con los demás, desarrollar la solidaridad, trascender la emocionalidad...",
            3: "Alcanzar la positividad en todos los renglones de su vida; desarrollar la confianza en sí mismos...",
            4: "Desarrollar la inteligencia, encontrar la sabiduría, el sentido de la responsabilidad, prestar servicio...",
            5: "Aprender a tener disciplina en todos los aspectos de su vida, desarrollar flexibilidad, movilidad interna...",
            6: "Encontrar a Dios dentro de sí mismos, desarrollar la fe, realizar un sendero espiritual...",
            7: "Convertirse en líderes, oradores, dirigentes, desarrollar la compasión y la misericordia...",
            8: "Desarrollar la constancia; aprender el manejo de la energía, superar los miedos, ser tolerantes...",
            9: "Realizarse en todas las áreas de su vida, concretar cosas, aprender a terminar todo aquello que comiencen...",
            10: "Encontrar su fuerza interna y externa, aprender a tener iniciativa, convertirse en 'punta de flecha'...",
            11: "Alcanzar en todo la supra conciencia, a realizarse espiritualmente en forma global, integral..."
            // Completa con los demás significados de misión del PDF.
        },
        coincidencias: { // Interpretar según las páginas 10-12 del PDF
            "1-2": "Coincidencia Esencia y Personalidad: Nos encontramos con un espejo, con alguien que refleja lo que es, auténtica...",
            "1-3": "Coincidencia Esencia y Regalo Omkin: Alguien con una oportunidad muy especial de vida, al demandar el regalo se activa lo positivo de la esencia...",
            "1-4": "Coincidencia Esencia y Vidas Pasadas: El número sigue siendo tan positivo ó negativo como elijas expresarlo, pero en un margen menor de negatividad...",
            "1-5": "Coincidencia Esencia y Misión: El individuo nace con la misión de conocerse a sí mismo...",
            "2-3": "Coincidencia Personalidad y Regalo Omkin: Expresará su Ego hasta que solicite su regalo; a partir de ese instante, el Ego desaparece...",
            "2-4": "Coincidencia Personalidad y Vidas Pasadas: La persona sigue creyendo que 'es' lo que 'fue' en vidas pasadas...",
            "2-5": "Coincidencia Personalidad y Misión: La personalidad está impulsando la realización de la misión...",
            "3-5": "Coincidencia Regalo Omkin y Misión: Persona verdaderamente regalada, al solicitar su regalo cumplirá su misión sin dificultad...",
            // "3-4": "Coincidencia Regalo Omkin y Vidas Pasadas: Caso excepcional, el Creador da el mismo número de regalo que tus vidas pasadas...", (El PDF indica que no es posible para nacidos en siglo XX)
            "4-5": "Coincidencia Vidas Pasadas y Misión: Hay repetición de aprendizaje, se viene a aprender el porcentaje que no se aprendió..."
            // Añade más interpretaciones de coincidencias si es necesario.
        }
    };

    // Función de reducción para Omkin-Kay: Reduce si es > 11, manteniendo 1-11 intactos.
    function reducirNumeroOmkinKay(num) {
        let numero = parseInt(num, 10);
        if (isNaN(numero)) return null; 

        while (numero > 11) {
            let sumaDigitos = 0;
            const digitosComoString = numero.toString().split('');
            for (const digito of digitosComoString) {
                sumaDigitos += parseInt(digito, 10);
            }
            numero = sumaDigitos;
        }
        return numero;
    }

    // Funciones de cálculo para cada cuadrante Omkin-Kay
    function calcularEsenciaOK(dia) {
        if (dia === 10) { // Excepción del PDF para el día 10
            return 10;
        }
        return reducirNumeroOmkinKay(dia);
    }

    function calcularPersonalidadOK(mes) {
        return reducirNumeroOmkinKay(mes);
    }

    function calcularRegaloOK(ano) {
        const ultimosDosDigitos = ano % 100;
        const dig1 = Math.floor(ultimosDosDigitos / 10);
        const dig2 = ultimosDosDigitos % 10;
        return reducirNumeroOmkinKay(dig1 + dig2);
    }

    function calcularVidasPasadasOK(ano) {
        const anoString = ano.toString();
        let sumaDigitosAno = 0;
        for (let i = 0; i < anoString.length; i++) {
            sumaDigitosAno += parseInt(anoString[i], 10);
        }
        return reducirNumeroOmkinKay(sumaDigitosAno);
    }

    function calcularMisionOK(dia, mes, ano) {
        const esenciaVal = calcularEsenciaOK(dia);
        const personalidadVal = calcularPersonalidadOK(mes);
        
        const anoString = ano.toString();
        let sumaDigitosAnoDirecta = 0;
        for (let i = 0; i < anoString.length; i++) {
            sumaDigitosAnoDirecta += parseInt(anoString[i], 10);
        }
        const sumaTotalMision = esenciaVal + personalidadVal + sumaDigitosAnoDirecta;
        return reducirNumeroOmkinKay(sumaTotalMision);
    }
    
    // Event listener para el botón de calcular Omkin-Kay
    if (calcularBtnOK) { // Asegurarse de que el botón exista en la página actual
        calcularBtnOK.addEventListener('click', () => {
            // Validar que todos los elementos del DOM necesarios existan antes de usarlos
            if (!diaInputOK || !mesInputOK || !anoInputOK || 
                !numeroEsenciaOKSpan || !significadoEsenciaOKP ||
                !numeroPersonalidadOKSpan || !significadoPersonalidadOKP ||
                !numeroRegaloOKSpan || !significadoRegaloOKP ||
                !numeroVidasPasadasOKSpan || !significadoVidasPasadasOKP ||
                !numeroMisionOKSpan || !significadoMisionOKP ||
                !textoCoincidenciasOKP) {
                console.error("Error: No se encontraron todos los elementos del DOM necesarios para Omkin-Kay.");
                // Podrías mostrar un mensaje al usuario aquí también si lo deseas
                if(textoCoincidenciasOKP) textoCoincidenciasOKP.innerHTML = `<p style="color: red;">Error de configuración de la página. Faltan elementos.</p>`;
                return;
            }

            const dia = parseInt(diaInputOK.value, 10);
            const mes = parseInt(mesInputOK.value, 10);
            const ano = parseInt(anoInputOK.value, 10);

            if (isNaN(dia) || isNaN(mes) || isNaN(ano) || dia < 1 || dia > 31 || mes < 1 || mes > 12 || ano < 1000 || ano > 2099) {
                numeroEsenciaOKSpan.textContent = "-"; significadoEsenciaOKP.textContent = "";
                numeroPersonalidadOKSpan.textContent = "-"; significadoPersonalidadOKP.textContent = "";
                numeroRegaloOKSpan.textContent = "-"; significadoRegaloOKP.textContent = "Este regalo es siempre el aspecto positivo del número y se activa conscientemente.";
                numeroVidasPasadasOKSpan.textContent = "-"; significadoVidasPasadasOKP.textContent = "";
                numeroMisionOKSpan.textContent = "-"; significadoMisionOKP.textContent = "";
                textoCoincidenciasOKP.innerHTML = `<p style="color: red;">Por favor, ingresa una fecha de nacimiento válida.</p>`;
                return;
            }

            const numEsencia = calcularEsenciaOK(dia);
            const numPersonalidad = calcularPersonalidadOK(mes);
            const numRegalo = calcularRegaloOK(ano);
            const numVidasPasadas = calcularVidasPasadasOK(ano);
            const numMision = calcularMisionOK(dia, mes, ano);

            // Mostrar números
            numeroEsenciaOKSpan.textContent = numEsencia !== null ? numEsencia : "-";
            numeroPersonalidadOKSpan.textContent = numPersonalidad !== null ? numPersonalidad : "-";
            numeroRegaloOKSpan.textContent = numRegalo !== null ? numRegalo : "-";
            numeroVidasPasadasOKSpan.textContent = numVidasPasadas !== null ? numVidasPasadas : "-";
            numeroMisionOKSpan.textContent = numMision !== null ? numMision : "-";

            // Mostrar significados (usando los textos que completarás en significadosOmkinKay)
            significadoEsenciaOKP.textContent = numEsencia !== null ? (significadosOmkinKay.esencia_personalidad[numEsencia] || "Significado no disponible.") : "";
            significadoPersonalidadOKP.textContent = numPersonalidad !== null ? (significadosOmkinKay.esencia_personalidad[numPersonalidad] || "Significado no disponible.") : "";
            significadoRegaloOKP.innerHTML = `Este regalo es siempre el aspecto positivo del número y se activa conscientemente. <br><em>Aspectos clave: ${numRegalo !== null ? (significadosOmkinKay.esencia_personalidad[numRegalo] || "No detallado.") : ""}</em>`;
            significadoVidasPasadasOKP.textContent = numVidasPasadas !== null ? `Refleja lo que más has trabajado (aprox. 70% positivo). Aspectos clave: ${significadosOmkinKay.esencia_personalidad[numVidasPasadas] || "Características no detalladas."}` : "";
            significadoMisionOKP.textContent = numMision !== null ? (significadosOmkinKay.mision[numMision] || "Significado no disponible.") : "";
            
            // Lógica de Coincidencias
            let textoCoincidencias = "";
            if (numEsencia !== null && numPersonalidad !== null && numEsencia === numPersonalidad) {
                textoCoincidencias += `<p><strong>Coincidencia Esencia (${numEsencia}) y Personalidad (${numPersonalidad}):</strong> ${significadosOmkinKay.coincidencias["1-2"] || "Autenticidad."}</p>`;
            }
            if (numEsencia !== null && numRegalo !== null && numEsencia === numRegalo) {
                 textoCoincidencias += `<p><strong>Coincidencia Esencia (${numEsencia}) y Regalo Omkin (${numRegalo}):</strong> ${significadosOmkinKay.coincidencias["1-3"] || "Oportunidad especial."}</p>`;
            }
            if (numEsencia !== null && numVidasPasadas !== null && numEsencia === numVidasPasadas) {
                textoCoincidencias += `<p><strong>Coincidencia Esencia (${numEsencia}) y Vidas Pasadas (${numVidasPasadas}):</strong> ${significadosOmkinKay.coincidencias["1-4"] || "Menor negatividad, aprendizaje avanzado."}</p>`;
            }
            if (numEsencia !== null && numMision !== null && numEsencia === numMision) {
                textoCoincidencias += `<p><strong>Coincidencia Esencia (${numEsencia}) y Misión (${numMision}):</strong> ${significadosOmkinKay.coincidencias["1-5"] || "Misión de autoconocimiento."}</p>`;
            }
            if (numPersonalidad !== null && numRegalo !== null && numPersonalidad === numRegalo) {
                textoCoincidencias += `<p><strong>Coincidencia Personalidad (${numPersonalidad}) y Regalo Omkin (${numRegalo}):</strong> ${significadosOmkinKay.coincidencias["2-3"] || "El Ego desaparece al activar el regalo."}</p>`;
            }
            if (numPersonalidad !== null && numVidasPasadas !== null && numPersonalidad === numVidasPasadas) {
                textoCoincidencias += `<p><strong>Coincidencia Personalidad (${numPersonalidad}) y Vidas Pasadas (${numVidasPasadas}):</strong> ${significadosOmkinKay.coincidencias["2-4"] || "Se sigue creyendo ser lo que se fue."}</p>`;
            }
            if (numPersonalidad !== null && numMision !== null && numPersonalidad === numMision) {
                textoCoincidencias += `<p><strong>Coincidencia Personalidad (${numPersonalidad}) y Misión (${numMision}):</strong> ${significadosOmkinKay.coincidencias["2-5"] || "La personalidad impulsa la misión."}</p>`;
            }
            if (numRegalo !== null && numMision !== null && numRegalo === numMision) {
                textoCoincidencias += `<p><strong>Coincidencia Regalo Omkin (${numRegalo}) y Misión (${numMision}):</strong> ${significadosOmkinKay.coincidencias["3-5"] || "Misión cumplida sin dificultad al activar el regalo."}</p>`;
            }
            // Nota: Coincidencia 3-4 (Regalo y Vidas Pasadas) es marcada como muy rara o no posible en siglo XX en el PDF.
            if (numVidasPasadas !== null && numMision !== null && numVidasPasadas === numMision) {
                textoCoincidencias += `<p><strong>Coincidencia Vidas Pasadas (${numVidasPasadas}) y Misión (${numMision}):</strong> ${significadosOmkinKay.coincidencias["4-5"] || "Repetición de aprendizaje."}</p>`;
            }

            if (textoCoincidencias === "") {
                textoCoincidenciasOKP.innerHTML = "<p>No se detectaron coincidencias especiales de cuadrantes.</p>";
            } else {
                textoCoincidenciasOKP.innerHTML = textoCoincidencias;
            }
        });
    }
    // --- FIN: LÓGICA PARA NUMEROLOGÍA OMKIN-KAY ---
});