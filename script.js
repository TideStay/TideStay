// Add ENTER key navigation for property-stepper and button show/hide
(function () {
    const stepperForm = document.getElementById('property-stepper');
    if (!stepperForm) return;

    const stepNextBtn = document.getElementById('step-next');
    const stepSubmitBtn = document.getElementById('step-submit');
    const stepPanels = stepperForm.querySelectorAll('.step-panel');
    const stepBackBtn = document.getElementById('step-back');

    // Show/hide correct buttons for current step
    function updateStepButtons() {
        const lang = localStorage.getItem('tidestay_lang') || 'en';
        const activePanel = stepperForm.querySelector('.step-panel[data-active="true"]');
        if (!activePanel) return;
        const step = parseInt(activePanel.getAttribute('data-step'), 10);

        if (stepNextBtn && stepSubmitBtn) {
            if (step === 3) {
                stepNextBtn.style.display = "none";
                stepSubmitBtn.style.display = "inline-block";
                stepSubmitBtn.textContent = lang === 'en' ? "Send Request" : "Enviar Pedido";
            } else {
                stepNextBtn.style.display = "inline-block";
                stepSubmitBtn.style.display = "none";
                stepNextBtn.textContent = lang === 'en' ? "Next" : "Seguinte";
            }
        }
        if (stepBackBtn) {
            if (step === 1) {
                stepBackBtn.style.visibility = "hidden";
                stepBackBtn.style.opacity = "0";
                stepBackBtn.disabled = true;
            } else {
                stepBackBtn.style.visibility = "visible";
                stepBackBtn.style.opacity = "1";
                stepBackBtn.disabled = false;
            }
        }
   

        const status = document.getElementById('step-form-status');
        if (status) {
            let msg = "";
            if (step === 1) {
                msg = lang === 'en' ? "Please add the property location to continue." : "Por favor, adicione a localização da propriedade.";
            } else if (step === 2) {
                msg = lang === 'en' ? "Please select the property condition to continue." : "Por favor, selecione o estado da propriedade.";
            } else if (step === 3) {
                msg = lang === 'en' ? "Ready when you are. Send your details." : "Tudo pronto. Envie os seus dados.";
            }
            status.textContent = msg;
        }
    }

    function getCurrentStep() {
        const activePanel = stepperForm.querySelector('.step-panel[data-active="true"]');
        if (!activePanel) return null;
        return parseInt(activePanel.getAttribute("data-step"), 10);
    }

    function validateStep(stepNum) {
        const lang = localStorage.getItem('tidestay_lang') || 'en';
        const status = document.getElementById('step-form-status');
        if (stepNum === 1) {
            const loc = document.getElementById("step1-location");
            if (!loc || typeof loc.value !== "string" || loc.value.trim().length === 0) {
                if (status) status.textContent = lang === 'en' ? "Please add the property location to continue." : "Por favor, adicione a localização da propriedade.";
                return false;
            }
        }
        if (stepNum === 2) {
            const cond = document.getElementById("step2-condition");
            if (!cond || typeof cond.value !== "string" || cond.value === "") {
                if (status) status.textContent = lang === 'en' ? "Please select the property condition to continue." : "Por favor, selecione o estado da propriedade.";
                return false;
            }
        }
        if (stepNum === 3) {
            const name = document.getElementById("step3-name");
            const email = document.getElementById("step3-email");
            const phone = document.getElementById("step3-phone");
            if (
                !(name && typeof name.value === "string" && name.value.trim().length > 0) ||
                !(email && typeof email.value === "string" && email.value.trim().length > 0) ||
                !(phone && typeof phone.value === "string" && phone.value.trim().length > 0)
            ) {
                if (status) status.textContent = lang === 'en' ? "Please complete your contact details correctly." : "Por favor, preencha os seus dados de contacto corretamente.";
                return false;
            }
        }
        if (status && stepNum === 3) {
            status.textContent = lang === 'en' ? "Ready when you are. Send your details." : "Tudo pronto. Envie os seus dados.";
        }
        return true;
    }

    function goToStep(stepNum) {
        if (!stepPanels || stepPanels.length === 0) return;
        stepPanels.forEach(panel => {
            const panelStep = parseInt(panel.getAttribute('data-step'), 10);
            const isActive = panelStep === stepNum;
            panel.setAttribute('data-active', isActive ? 'true' : 'false');
            panel.style.display = isActive ? "" : "none";
        });
        const dots = document.querySelectorAll('.step-dot');
        if (dots && dots.length > 0) {
            dots.forEach((dot, idx) => {
                if (idx === (stepNum - 1)) {
                    dot.classList.add('is-active');
                } else {
                    dot.classList.remove('is-active');
                }
            });
        }
        updateStepButtons();
    }

    function nextStepOrSubmit() {
        const current = getCurrentStep();
        if (!current) return false;
        if (!validateStep(current)) return false;
        if (current < 3) {
            goToStep(current + 1);
        } else if (current === 3) {
            if (stepperForm.requestSubmit) {
                stepperForm.requestSubmit();
            } else {
                stepperForm.submit();
            }
        }
        return true;
    }

    stepperForm.addEventListener("keydown", function (e) {
        if (e.key !== "Enter" || e.defaultPrevented) return;
        const tag = e.target.tagName;
        const type = (e.target.type || '').toLowerCase();
        const isInput = tag === "INPUT" || tag === "SELECT";
        const isTextarea = tag === "TEXTAREA";

        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
        if (isTextarea) {
            return; // Allow line breaks in textarea
        } else if (isInput) {
            // Prevent default only on multi-step fields, not on buttons/checkboxes/etc.
            if (type !== 'submit' && type !== 'button' && type !== 'reset') {
                e.preventDefault();
                nextStepOrSubmit();
            }
        }
    });

    if (stepNextBtn) {
        stepNextBtn.addEventListener("click", function () {
            const current = getCurrentStep();
            if (!validateStep(current)) return;
            if (current < 3) goToStep(current + 1);
        });
    }

    if (stepBackBtn) {
        stepBackBtn.addEventListener("click", function () {
            const current = getCurrentStep();
            if (current > 1) goToStep(current - 1);
        });
    }

    const thankYouDiv = document.getElementById('thank-you-message');
    const closeBtn = document.getElementById('close-thank-you');

    if (stepperForm && thankYouDiv) {
        stepperForm.addEventListener('submit', function (e) {
            e.preventDefault();
            stepperForm.style.display = "none";
            thankYouDiv.style.display = "flex";
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function () {
                thankYouDiv.style.display = "none";
                stepperForm.reset();
                stepPanels.forEach((panel, idx) => {
                    if (idx === 0) {
                        panel.style.display = "";
                        panel.setAttribute('data-active', "true");
                    } else {
                        panel.style.display = "none";
                        panel.setAttribute('data-active', "false");
                    }
                });
                goToStep(1);
                stepperForm.style.display = "";
                const status = document.getElementById('step-form-status');
                if (status) status.textContent = "";
            });
        }
    }
    goToStep(1);
})();

// Language Translation Engine
const translations = {
    "en": {
        nav_about: "About",
        nav_cases: "Results",
        nav_stays: "Our Stays",
        nav_plans: "Services",
        nav_calculator: "Calculator",
        nav_contact: "Contact",
        "hero_title": "TideStay",
        "hero_subtitle": "We treat your property <span class='font-serif italic font-medium text-[#b8860b]'>like it's our own</span>. Uncompromising boutique management for total peace of mind.",
        "hero_btn_contact": "Request a Proposal",
        "hero_btn_book": "Book a Stay", // <-- שורה חדשה להוסיף
        "hero_btn_plans": "View Our Plans",
        "about_title": "Professional Management,<br>Personal Care",
        "feature1_title": "Curated Excellence",
        "feature1_desc": "We favor quality over volume. By limiting our portfolio, we ensure every property receives our uncompromising, high-end attention.",
        "feature2_title": "Family-Driven Touch",
        "feature2_desc": "You’re not just a client; you’re part of our inner circle. We manage every home with the personal care of a dedicated family team.",
        "feature3_title": "Proactive Peace of Mind",
        "feature3_desc": "From 24/7 support to meticulous on-site inspections, we bridge professional management with total reliability.",

        /* Case Studies */
        "cases_tag": "Real Transformations • Real Returns",
        "cases_title": "From Idle Properties to 5-Star Success",
        "cases_subtitle": "See how our hands-on local management turns underperforming and vacant homes into high-yield, top-rated assets.",
        "case_before_title": "The Situation Before:",
        "case_after_title": "The TideStay Impact:",
        "case_guest_feedback": "Verified Guest Review:",
        "case1_before_text": "Owner based overseas with zero availability. Previous management company abandoned the property due to low returns. The villa sat empty for 6 months.",
        "case1_after_text": "Listing revamp & professional setup. Secured recurring direct partnerships with high-tier Surf Camps (6 back-to-back groups at €2,000/group) yielding 95% peak occupancy + flawless 5.0★ reviews.",
        "case1_stat_occ": "Peak Season Occupancy",
        "case1_stat_rev": "Camp Partnership Revenue",
        "case2_before_text": "Owner managing remotely from abroad with just a cleaner. Stagnant 4.4 rating, deteriorating garden, mold build-up, and vacant for nearly an entire year.",
        "case2_after_text": "Full on-site overhaul: mold remediation, garden landscaping, co-working setup, new furniture. Elevated listing to official Airbnb 'Guest Favourite' with 100% summer occupancy.",
        "case2_stat_summer": "Summer Peak Booking",
        "case2_stat_badge": "Official Airbnb Badge",

        /* Portfolio / Stays */
        "portfolio_tag": "Our Managed Properties",
        "portfolio_title": "Curated Coastal Stays",
        "portfolio_subtitle": "Planning a trip or looking for extended remote work? Book directly with us for the best local rates and boutique hospitality.",
        "stay1_desc": "Spacious 4BR retreat with a private master suite, chef's kitchen, and a signature all-weather enclosed BBQ patio. Surf & family ready.",
        "stay2_desc": "Ocean-view 4BR villa with private balconies, landscaped green backyard, garage, and large co-working dining space. Minutes to the sea.",
        "stay_btn_inquire": "Inquire Direct Dates",

        /* Plans */
        "plans_title": "Our Plans",
        "plans_subtitle": "Tailored to fit your needs, finalized together.",
        "mgmt_fee": "Management Fee",
        "plan1_title": "Smart",
        "plan1_tags": "Efficient • Digital • High-Yield",
        "p1_li1_b": "Professional Listing:", "p1_li1_t": " Full optimization on Airbnb & Booking.com.",
        "p1_li2_b": "Dynamic Pricing:", "p1_li2_t": " AI-driven daily price adjustments.",
        "p1_li3_b": "24/7 Guest Support:", "p1_li3_t": " We handle all inquiries and relations.",
        "p1_li4_b": "Seamless Self Check-in:", "p1_li4_t": " Digital arrival guides & smart-lock.",
        "p1_li5_b": "Cleaning Coordination:", "p1_li5_t": " Professional automated scheduling.",
        "p1_li6_b": "Legal Compliance:", "p1_li6_t": " SEF reporting and Tourist Tax.",
        "plan2_badge": "The Personal Choice",
        "plan2_title": "Popular",
        "plan2_tags": "Hands-On • Professional • Stress-Free",
        "everything_smart": "Everything in Smart, plus:",
        "p2_li1_b": "Personal Welcome:", "p2_li1_t": " In-person check-in for a boutique touch.",
        "p2_li2_b": "Quality Inspections:", "p2_li2_t": " We physically verify every cleaning.",
        "p2_li3_b": "Linen & Laundry:", "p2_li3_t": " Management of hotel-grade linens.",
        "p2_li4_b": "On-Site Support:", "p2_li4_t": " Handling minor repairs and technical issues.",
        "p2_li5_b": "Local Welcome Gift:", "p2_li5_t": " Curated treats for 5-star reviews.",
        "plan3_title": "Plus",
        "plan3_tags": "Total Peace • Premium Care",
        "everything_popular": "Everything in Popular, plus:",
        "p3_li1_b": "Weekly Inspections:", "p3_li1_t": " Essential for the coastal climate.",
        "p3_li2_b": "Utility Management:", "p3_li2_t": " We handle all bills (Water, Elec, Net).",
        "p3_li3_b": "Ericeira Concierge:", "p3_li3_t": " Booking surfing, transfers, and dining.",
        "p3_li4_b": "Interior Styling:", "p3_li4_t": " Professional seasonal decor updates.",
        "p3_li5_b": "Performance Analytics:", "p3_li5_t": " Monthly financial deep-dives.",
        
        /* Calculator & Form */
        "roi_title": "Check Your Profitability",
        "roi_subtitle": "Use this quick estimate to understand the profitability potential before choosing TideStay.",
        "roi_purchase_label": "Purchase Price (€)", "roi_purchase_ph": "e.g. 250000",
        "roi_renov_label": "Renovation Costs (€)", "roi_renov_ph": "e.g. 30000",
        "roi_rent_label": "Expected Monthly Rent (€)", "roi_rent_ph": "e.g. 3500",
        "roi_btn": "Calculate ROI",
        "roi_note": "We subtract 200€ fixed costs/month + 20% management fee.",
        "roi_results_title": "Your Results",
        "roi_annual_label": "Annual Net Profit",
        "roi_hint": "Enter the numbers to see an estimate.",
        "form_title": "Property Inquiry",
        "form_subtitle": "Tell us where your property is and we will get back to you.",
        "step1_tab": "1. Location", "step2_tab": "2. Condition", "step3_tab": "3. Contact",
        "step1_label": "1) Where is the property located?", "step1_ph": "e.g. Ericeira / Peniche / Baleal",
        "step1_hint": "You can write city, neighborhood, or approximate area.",
        "step2_label": "2) What is the property condition?",
        "step2_opt1": "Select one", "step2_opt2": "Renovated / Updated", "step2_opt3": "New / Recently refurbished", "step2_opt4": "Older but ready for rentals", "step2_opt5": "In progress", "step2_opt6": "Not sure yet",
        "step2_notes_label": "Optional notes", "step2_notes_ph": "Any details that could help us advise you...",
        "step3_name_label": "3) Your name", "step3_name_ph": "Full name",
        "step3_email_label": "Email", "step3_email_ph": "name@example.com",
        "step3_phone_label": "Phone / WhatsApp",
        "step3_hint": "After you press Send, we will receive your inquiry and get back to you shortly.",
        "btn_back": "Back", "btn_next": "Next", "btn_send": "Send Request",
        "tnx_title": "Thank you for your details!", "tnx_desc": "We will get back to you shortly.", "btn_ok": "OK"
    },
    "pt": {
        nav_about: "Sobre",
        nav_cases: "Resultados",
        nav_stays: "Propriedades",
        nav_plans: "Serviços",
        nav_calculator: "Simulador",
        nav_contact: "Contactos",
        "hero_title": "TideStay",
        "hero_subtitle": "Cuidamos da sua propriedade <span class='font-serif italic font-medium text-[#b8860b]'>como se fosse nossa</span>. Gestão boutique rigorosa para total tranquilidade.",
        "hero_btn_contact": "Pedir Proposta",
        "hero_btn_book": "Reservar uma Estadia", // <-- שורה חדשה להוסיף
        "hero_btn_plans": "Ver os Planos",
        "about_title": "Gestão Profissional,<br>Cuidado Pessoal",
        "feature1_title": "Excelência Seleta",
        "feature1_desc": "Privilegiamos a qualidade em detrimento do volume. Ao limitarmos o nosso portfólio, garantimos que cada propriedade recebe uma atenção rigorosa e de excelência.",
        "feature2_title": "Toque Familiar",
        "feature2_desc": "Não é apenas um cliente; faz parte do nosso círculo mais próximo. Gerimos cada casa com o cuidado pessoal de uma equipa familiar dedicada.",
        "feature3_title": "Tranquilidade Proativa",
        "feature3_desc": "Desde o apoio 24/7 a inspeções minuciosas no local, aliamos a gestão profissional a uma fiabilidade total.",

        /* Case Studies PT */
        "cases_tag": "Transformações Reais • Rendimento Real",
        "cases_title": "De Imóveis Vazios ao Sucesso de 5 Estrelas",
        "cases_subtitle": "Veja como a nossa gestão local e dedicada transforma imóveis com baixo rendimento em ativos rentáveis e com pontuação máxima.",
        "case_before_title": "A Situação Anterior:",
        "case_after_title": "O Impacto TideStay:",
        "case_guest_feedback": "Avaliação Real de Hóspede:",
        "case1_before_text": "Proprietário a residir no estrangeiro sem disponibilidade. A agência anterior abandonou o imóvel por falta de rentabilidade. A moradia ficou fechada durante 6 meses.",
        "case1_after_text": "Renovação completa do anúncio e estratégia ativa. Parcerias diretas com Surf Camps de topo (6 grupos seguidos a 2.000€/grupo), atingindo 95% de ocupação e 5.0★ no Airbnb.",
        "case1_stat_occ": "Taxa de Ocupação no Pico",
        "case1_stat_rev": "Faturação Direta Surf Camps",
        "case2_before_text": "Proprietário a tentar gerir à distância apenas com serviço de limpeza. Classificação estagnada em 4.4, jardim degradado, problemas de humidade e casa fechada há quase um ano.",
        "case2_after_text": "Intervenção total no local: tratamento de humidades, arranjo do jardim, zona de coworking e mobiliário novo. Conquista do selo 'Preferido dos Hóspedes' e 100% de ocupação no verão.",
        "case2_stat_summer": "Ocupação no Verão",
        "case2_stat_badge": "Selo Oficial Airbnb",

        /* Portfolio / Stays PT */
        "portfolio_tag": "As Nossas Propriedades",
        "portfolio_title": "Estadias Selecionadas na Costa",
        "portfolio_subtitle": "Vai viajar ou trabalhar remotamente? Reserve diretamente connosco para obter os melhores preços e um serviço boutique.",
        "stay1_desc": "Espaçosa moradia T4 com suite master, cozinha de chef e um pátio de barbecue fechado ideal para todas as estações. Perfeita para famílias e surfistas.",
        "stay2_desc": "Moradia T4 com vista de mar, varandas privadas, jardim renovado, garagem e ampla mesa de refeições/coworking. A minutos da praia.",
        "stay_btn_inquire": "Consultar Datas Diretas",

        /* Plans PT */
        "plans_title": "Os Nossos Planos",
        "plans_subtitle": "Adaptados às suas necessidades, finalizados em conjunto.",
        "mgmt_fee": "Taxa de Gestão",
        "plan1_title": "Smart",
        "plan1_tags": "Eficiente • Digital • Alta Rentabilidade",
        "p1_li1_b": "Anúncio Profissional:", "p1_li1_t": " Otimização total no Airbnb e Booking.com.",
        "p1_li2_b": "Preços Dinâmicos:", "p1_li2_t": " Ajustes diários de preços gerados por IA.",
        "p1_li3_b": "Apoio ao Hóspede 24/7:", "p1_li3_t": " Tratamos de todas as questões e contactos.",
        "p1_li4_b": "Self Check-in Simples:", "p1_li4_t": " Guias de chegada digitais e fechadura inteligente.",
        "p1_li5_b": "Coordenação de Limpezas:", "p1_li5_t": " Agendamento profissional automatizado.",
        "p1_li6_b": "Conformidade Legal:", "p1_li6_t": " Comunicação ao SEF e Taxa Turística.",
        "plan2_badge": "A Escolha Mais Popular",
        "plan2_title": "Popular",
        "plan2_tags": "Acompanhamento • Profissional • Sem Stresse",
        "everything_smart": "Tudo no plano Smart, mais:",
        "p2_li1_b": "Receção Pessoal:", "p2_li1_t": " Check-in presencial para um toque boutique.",
        "p2_li2_b": "Inspeções de Qualidade:", "p2_li2_t": " Verificamos fisicamente todas as limpezas.",
        "p2_li3_b": "Roupas e Lavandaria:", "p2_li3_t": " Gestão de roupas de cama com qualidade de hotel.",
        "p2_li4_b": "Apoio no Local:", "p2_li4_t": " Tratamento de pequenas reparações e problemas técnicos.",
        "p2_li5_b": "Oferta de Boas-vindas:", "p2_li5_t": " Mimos selecionados para avaliações de 5 estrelas.",
        "plan3_title": "Plus",
        "plan3_tags": "Paz Total • Cuidado Premium",
        "everything_popular": "Tudo no plano Popular, mais:",
        "p3_li1_b": "Inspeções Semanais:", "p3_li1_t": " Essencial para o clima costeiro.",
        "p3_li2_b": "Gestão de Despesas:", "p3_li2_t": " Tratamos de todas as faturas (Água, Luz, Net).",
        "p3_li3_b": "Concierge na Ericeira:", "p3_li3_t": " Marcação de surf, transfers e restaurantes.",
        "p3_li4_b": "Styling de Interiores:", "p3_li4_t": " Atualizações profissionais da decoração sazonal.",
        "p3_li5_b": "Análise de Desempenho:", "p3_li5_t": " Análise financeira mensal detalhada.",
        
        /* Calculator & Form PT */
        "roi_title": "Verifique a Sua Rentabilidade",
        "roi_subtitle": "Use esta estimativa rápida para entender o potencial de rentabilidade antes de escolher a TideStay.",
        "roi_purchase_label": "Preço de Compra (€)", "roi_purchase_ph": "ex. 250000",
        "roi_renov_label": "Custos de Renovação (€)", "roi_renov_ph": "ex. 30000",
        "roi_rent_label": "Renda Mensal Esperada (€)", "roi_rent_ph": "ex. 3500",
        "roi_btn": "Calcular ROI",
        "roi_note": "Subtraímos 200€ de custos fixos/mês + 20% de taxa de gestão.",
        "roi_results_title": "Os Seus Resultados",
        "roi_annual_label": "Lucro Líquido Anual",
        "roi_hint": "Insira os valores para ver a estimativa.",
        "form_title": "Pedido de Informação",
        "form_subtitle": "Diga-nos onde fica a sua propriedade e entraremos em contacto.",
        "step1_tab": "1. Localização", "step2_tab": "2. Estado", "step3_tab": "3. Contacto",
        "step1_label": "1) Onde se localiza a propriedade?", "step1_ph": "ex. Ericeira / Peniche / Baleal",
        "step1_hint": "Pode escrever a cidade, bairro ou área aproximada.",
        "step2_label": "2) Qual o estado da propriedade?",
        "step2_opt1": "Selecione uma opção", "step2_opt2": "Renovada / Atualizada", "step2_opt3": "Nova / Remodelada recentemente", "step2_opt4": "Antiga mas pronta para arrendar", "step2_opt5": "Em obras", "step2_opt6": "Ainda não tenho a certeza",
        "step2_notes_label": "Notas opcionais", "step2_notes_ph": "Qualquer detalhe que nos ajude a aconselhá-lo...",
        "step3_name_label": "3) O seu nome", "step3_name_ph": "Nome completo",
        "step3_email_label": "Email", "step3_email_ph": "nome@exemplo.com",
        "step3_phone_label": "Telefone / WhatsApp",
        "step3_hint": "Após clicar em Enviar, receberemos o seu pedido e entraremos em contacto em breve.",
        "btn_back": "Voltar", "btn_next": "Seguinte", "btn_send": "Enviar Pedido",
        "tnx_title": "Obrigado pelos seus dados!", "tnx_desc": "Entraremos em contacto consigo em breve.", "btn_ok": "OK"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const langToggle = document.getElementById('lang-toggle');
    if (!langToggle) return;

    let currentLang = localStorage.getItem('tidestay_lang') || 'en';

    window.updateLanguage = (lang) => {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else if (el.tagName === 'OPTION') {
                    el.textContent = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        langToggle.textContent = lang === 'en' ? 'PT' : 'EN';
        document.documentElement.lang = lang;
    };

    window.updateLanguage(currentLang);

    langToggle.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'pt' : 'en';
        localStorage.setItem('tidestay_lang', currentLang);
        window.updateLanguage(currentLang);
    });

    // -------- ROI Calculator Logic --------
    const roiBtn = document.getElementById('roi-calc');
    if (roiBtn) {
        roiBtn.addEventListener('click', function () {
            const purchaseInput = document.getElementById('roi-purchase');
            const renovInput = document.getElementById('roi-renovation');
            const rentInput = document.getElementById('roi-rent');
            const annualNetEl = document.getElementById('roi-annual-net');
            const roiPercentEl = document.getElementById('roi-percent');
            const roiHint = document.getElementById('roi-hint');

            // Parse values - strip all except digits and dot, but also remove thousands separator "." if used for thousands
            function cleanInput(val) {
                if (typeof val !== 'string') return '';
                // Accept comma or dot as decimal, but prefer dot for JS parseFloat
                // Remove all except digits, comma, and dot
                let cleaned = val.replace(/[^\d.,]/g, '');
                // If both "," and ".", replace "," by "" (remove thousands),
                // e.g. "1,234.56" => "1234.56", "1.234,56" => "1234,56"
                if (cleaned.indexOf('.') > -1 && cleaned.indexOf(',') > -1) {
                    if (cleaned.lastIndexOf('.') > cleaned.lastIndexOf(',')) {
                        // "1,234.56" or similar: remove commas (thousands)
                        cleaned = cleaned.replace(/,/g, '');
                    } else {
                        // "1.234,56" or similar: remove dots (thousands), change "," to "."
                        cleaned = cleaned.replace(/\./g, '').replace(',', '.');
                    }
                } else if (cleaned.indexOf(',') > -1) {
                    // Only comma, probably decimal: replace , by .
                    cleaned = cleaned.replace(',', '.');
                }
                return cleaned;
            }
            const purchaseVal = Number(cleanInput((purchaseInput && purchaseInput.value) ? purchaseInput.value : ""));
            const renovVal = Number(cleanInput((renovInput && renovInput.value) ? renovInput.value : ""));
            const rentVal = Number(cleanInput((rentInput && rentInput.value) ? rentInput.value : ""));

            if (
                !purchaseInput || !renovInput || !rentInput || !annualNetEl || !roiPercentEl ||
                isNaN(purchaseVal) || isNaN(renovVal) || isNaN(rentVal) ||
                purchaseVal <= 0 || rentVal <= 0 || renovVal < 0
            ) {
                // If inputs are missing or invalid
                if (roiHint) roiHint.style.display = "";
                if (annualNetEl) annualNetEl.textContent = "";
                if (roiPercentEl) roiPercentEl.textContent = "";
                return;
            }

            // 2. Total Investment
            const totalInvestment = purchaseVal + renovVal;
            // 3. Monthly Gross Rent
            const monthlyGrossRent = rentVal;
            // 4. Monthly Net Profit
            const monthlyNetProfit = monthlyGrossRent - 200 - (monthlyGrossRent * 0.20);
            // 5. Annual Net Profit
            const annualNetProfit = monthlyNetProfit * 12;
            // 6. ROI Percentage
            const roiPct = (totalInvestment > 0) ? (annualNetProfit / totalInvestment) * 100 : 0;

            // 7. Update DOM
            let locale = currentLang === "pt" ? "pt-PT" : "en-US";
            let formattedAnnual = annualNetProfit.toLocaleString(locale, { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
            annualNetEl.textContent = formattedAnnual;
            roiPercentEl.textContent = roiPct.toFixed(1);

            if (roiHint) {
                roiHint.style.display = "none";
            }
        });
    }
});