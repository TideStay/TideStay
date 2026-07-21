// Add ENTER key navigation for property-stepper and button show/hide
(function() {
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

        if (step === 3) {
            stepNextBtn.style.display = "none";
            stepSubmitBtn.style.display = "";
            stepSubmitBtn.textContent = lang === 'en' ? "Send Request" : "Enviar Pedido";
        } else {
            stepNextBtn.style.display = "";
            stepSubmitBtn.style.display = "none";
            stepNextBtn.textContent = lang === 'en' ? "Next" : "Seguinte";
        }
        if (step === 1) {
            stepBackBtn.style.visibility = "hidden";
            stepBackBtn.style.opacity = "0";
            stepBackBtn.disabled = true; 
        } else {
            stepBackBtn.style.visibility = "";
            stepBackBtn.style.opacity = "1";
            stepBackBtn.disabled = false;
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
            if (!loc || loc.value.trim().length === 0) {
                if (status) status.textContent = lang === 'en' ? "Please add the property location to continue." : "Por favor, adicione a localização da propriedade.";
                return false;
            }
        }
        if (stepNum === 2) {
            const cond = document.getElementById("step2-condition");
            if (!cond || !cond.value || cond.value === "") {
                if (status) status.textContent = lang === 'en' ? "Please select the property condition to continue." : "Por favor, selecione o estado da propriedade.";
                return false;
            }
        }
        if (stepNum === 3) {
            const name = document.getElementById("step3-name");
            const email = document.getElementById("step3-email");
            const phone = document.getElementById("step3-phone");
            if (!(name && name.value.trim().length > 0 && email && email.value.trim().length > 0 && phone && phone.value.trim().length > 0)) {
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
        stepPanels.forEach(panel => {
            const isActive = parseInt(panel.getAttribute('data-step'), 10) === stepNum;
            panel.setAttribute('data-active', isActive ? 'true' : 'false');
            panel.style.display = isActive ? "" : "none";
        });
        document.querySelectorAll('.step-dot').forEach((dot, idx) => {
            if (idx === (stepNum - 1)) {
                dot.classList.add('is-active');
            } else {
                dot.classList.remove('is-active');
            }
        });
        updateStepButtons();
    }

    function nextStepOrSubmit() {
        const current = getCurrentStep();
        if (!current) return false;
        if (!validateStep(current)) return false;
        if (current < 3) {
            goToStep(current + 1);
        } else if (current === 3) {
            stepperForm.requestSubmit ? stepperForm.requestSubmit() : stepperForm.submit();
        }
        return true;
    }

    stepperForm.addEventListener("keydown", function(e) {
        if (e.key !== "Enter" || e.defaultPrevented) return;
        let isInput = e.target.tagName === "INPUT" || e.target.tagName === "SELECT";
        let isTextarea = e.target.tagName === "TEXTAREA";
        if (e.ctrlKey || e.altKey || e.shiftKey || e.metaKey) return;
        if (isTextarea) {
            return;
        } else if (isInput || e.target.tagName === "SELECT") {
            e.preventDefault();
            nextStepOrSubmit();
        }
    });

    stepNextBtn.addEventListener("click", function() {
        const current = getCurrentStep();
        if (!validateStep(current)) return;
        if (current < 3) goToStep(current + 1);
    });

    stepBackBtn.addEventListener("click", function() {
        const current = getCurrentStep();
        if (current > 1) goToStep(current - 1);
    });

    const thankYouDiv = document.getElementById('thank-you-message');
    const closeBtn = document.getElementById('close-thank-you');

    if (stepperForm && thankYouDiv) {
        stepperForm.addEventListener('submit', function(e) {
            e.preventDefault();
            stepperForm.style.display = "none";
            thankYouDiv.style.display = "flex";
        });

        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
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
                if(status) status.textContent = "";
            });
        }
    }
    goToStep(1); 
})();

// Language Translation Engine
const translations = {
  "en": {
    "hero_title": "TideStay Ericeira",
    "hero_subtitle": "Boutique Property Management",
    "about_title": "Professional Management,<br>Personal Care",
    "feature1_title": "Curated Excellence",
    "feature1_desc": "We favor quality over volume. By limiting our portfolio, we ensure every property receives our uncompromising, high-end attention.",
    "feature2_title": "Family-Driven Touch",
    "feature2_desc": "You’re not just a client; you’re part of our inner circle. We manage every home with the personal care of a dedicated family team.",
    "feature3_title": "Proactive Peace of Mind",
    "feature3_desc": "From 24/7 support to meticulous on-site inspections, we bridge professional management with total reliability.",
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
    "test_title": "What Our Partners Say",
    "roi_title": "Check Your Profitability",
    "roi_subtitle": "Use this quick estimate to understand the profitability potential before choosing TideStay for long-term or short-term management.",
    "roi_purchase_label": "Purchase Price (€)", "roi_purchase_ph": "e.g. 250000",
    "roi_renov_label": "Renovation Costs (€)", "roi_renov_ph": "e.g. 30000",
    "roi_rent_label": "Expected Monthly Rent (€)", "roi_rent_ph": "e.g. 3500",
    "roi_btn": "Calculate ROI",
    "roi_note": "We subtract 200€ fixed costs/month + 20% management fee.",
    "roi_results_title": "Your Results",
    "roi_annual_label": "Annual Net Profit",
    "form_title": "Property Inquiry",
    "form_subtitle": "Tell us where your property is and we will get back to you.",
    "step1_tab": "1. Location", "step2_tab": "2. Condition", "step3_tab": "3. Contact",
    "step1_label": "1) Where is the property located?", "step1_ph": "e.g. Ericeira / São Sebastião / near Lisbon",
    "step1_hint": "You can write city, neighborhood, or approximate area.",
    "step2_label": "2) What is the property condition?",
    "step2_opt1": "Select one", "step2_opt2": "Renovated / Updated", "step2_opt3": "New / Recently refurbished", "step2_opt4": "Older but ready for rentals", "step2_opt5": "In progress", "step2_opt6": "Not sure yet",
    "step2_notes_label": "Optional notes", "step2_notes_ph": "Any details that could help us advise you (size, upgrades, timeline...)",
    "step3_name_label": "3) Your name", "step3_name_ph": "Full name",
    "step3_email_label": "Email", "step3_email_ph": "name@example.com",
    "step3_phone_label": "Phone / WhatsApp",
    "step3_hint": "After you press Send, we will receive your inquiry and get back to you shortly.",
    "btn_back": "Back", "btn_next": "Next", "btn_send": "Send Request",
    "tnx_title": "Thank you for your details!", "tnx_desc": "We will get back to you shortly.", "btn_ok": "OK",
    "footer_brand": "TideStay Ericeira",
    "footer_fb": "Follow us on Facebook",
    "footer_copy": "Boutique Property Management &copy; 2024"
  },
  "pt": {
    "hero_title": "TideStay Ericeira",
    "hero_subtitle": "Gestão de Propriedades Boutique",
    "about_title": "Gestão Profissional,<br>Cuidado Pessoal",
    "feature1_title": "Excelência Seleta",
    "feature1_desc": "Privilegiamos a qualidade em detrimento do volume. Ao limitarmos o nosso portfólio, garantimos que cada propriedade recebe uma atenção rigorosa e de excelência.",
    "feature2_title": "Toque Familiar",
    "feature2_desc": "Não é apenas um cliente; faz parte do nosso círculo mais próximo. Gerimos cada casa com o cuidado pessoal de uma equipa familiar dedicada.",
    "feature3_title": "Tranquilidade Proativa",
    "feature3_desc": "Desde o apoio 24/7 a inspeções minuciosas no local, aliamos a gestão profissional a uma fiabilidade total.",
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
    "test_title": "O Que Dizem os Nossos Parceiros",
    "roi_title": "Verifique a Sua Rentabilidade",
    "roi_subtitle": "Use esta estimativa rápida para entender o potencial de rentabilidade antes de escolher a TideStay.",
    "roi_purchase_label": "Preço de Compra (€)", "roi_purchase_ph": "ex. 250000",
    "roi_renov_label": "Custos de Renovação (€)", "roi_renov_ph": "ex. 30000",
    "roi_rent_label": "Renda Mensal Esperada (€)", "roi_rent_ph": "ex. 3500",
    "roi_btn": "Calcular ROI",
    "roi_note": "Subtraímos 200€ de custos fixos/mês + 20% de taxa de gestão.",
    "roi_results_title": "Os Seus Resultados",
    "roi_annual_label": "Lucro Líquido Anual",
    "form_title": "Pedido de Informação",
    "form_subtitle": "Diga-nos onde fica a sua propriedade e entraremos em contacto.",
    "step1_tab": "1. Localização", "step2_tab": "2. Estado", "step3_tab": "3. Contacto",
    "step1_label": "1) Onde se localiza a propriedade?", "step1_ph": "ex. Ericeira / São Sebastião / perto de Lisboa",
    "step1_hint": "Pode escrever a cidade, bairro ou área aproximada.",
    "step2_label": "2) Qual o estado da propriedade?",
    "step2_opt1": "Selecione uma opção", "step2_opt2": "Renovada / Atualizada", "step2_opt3": "Nova / Remodelada recentemente", "step2_opt4": "Antiga mas pronta para arrendar", "step2_opt5": "Em obras", "step2_opt6": "Ainda não tenho a certeza",
    "step2_notes_label": "Notas opcionais", "step2_notes_ph": "Qualquer detalhe que nos ajude a aconselhá-lo (tamanho, melhorias, prazos...)",
    "step3_name_label": "3) O seu nome", "step3_name_ph": "Nome completo",
    "step3_email_label": "Email", "step3_email_ph": "nome@exemplo.com",
    "step3_phone_label": "Telefone / WhatsApp",
    "step3_hint": "Após clicar em Enviar, receberemos o seu pedido e entraremos em contacto em breve.",
    "btn_back": "Voltar", "btn_next": "Seguinte", "btn_send": "Enviar Pedido",
    "tnx_title": "Obrigado pelos seus dados!", "tnx_desc": "Entraremos em contacto consigo em breve.", "btn_ok": "OK",
    "footer_brand": "TideStay Ericeira",
    "footer_fb": "Siga-nos no Facebook",
    "footer_copy": "Gestão de Propriedades Boutique &copy; 2024"
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
});