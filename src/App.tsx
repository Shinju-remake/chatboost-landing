import React, { useState, useEffect } from 'react';

function App() {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Tab 1");
  

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const wf = (window as any).Webflow;
    if (wf && wf.ready) {
        wf.ready();
    }
  }, []);

  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoMessages, setDemoMessages] = useState([
    { role: 'bot', text: 'Hi! I am the ChatBoost by Shinju AI assistant. I can show you how our AI transforms business operations. Which would you like to explore?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "How does it work?",
    "Show me pricing",
    "Restaurant demo",
    "Real Estate demo",
    "How do I get started?"
  ];

  const handleQuickQuestion = (question: string) => {
    if (isTyping) return;
    processMessage(question);
  };

  const processMessage = (input: string) => {
    const newMessages = [...demoMessages, { role: 'user', text: input }];
    setDemoMessages(newMessages);
    setUserInput('');
    setIsTyping(true);

    // AI Intent Logic
    setTimeout(() => {
      let response = "That's a great question! ChatBoost by Shinju AI is designed to handle exactly that. Would you like to see our pricing or try a free trial?";
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('hello') || lowerInput.includes('hi') || lowerInput.includes('hey')) {
        response = "Hello! I'm here to show you how Shinju AI can transform your customer engagement. Select one of the options below to see me in action!";
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('plan')) {
        response = "Our plans start at $49/mo for small businesses. Our Professional plan ($199/mo) includes advanced RAG (Knowledge Base) and WhatsApp integration. Which one fits your needs?";
      } else if (lowerInput.includes('work') || lowerInput.includes('how')) {
        response = "It's a simple 3-step process: 1. Connect your business data, 2. Customize the AI's tone, and 3. Deploy to your site or social media. We handle the technical setup!";
      } else if (lowerInput.includes('restaurant') || lowerInput.includes('food') || lowerInput.includes('order')) {
        response = "For restaurants like Shinju Bistro, I act as an AI Waiter—taking orders, handling bookings, and up-selling sides automatically. Order volume usually jumps by 300%!";
      } else if (lowerInput.includes('real estate') || lowerInput.includes('lead')) {
        response = "In real estate, I qualify leads 24/7 by asking about budget and location. This ensures your agents only spend time on high-intent buyers.";
      } else if (lowerInput.includes('start')) {
        response = "Ready to boost your sales? Click the 'Get Started' button on the page to begin your 14-day free trial. I can have your first bot ready in minutes!";
      }

      setDemoMessages([...newMessages, { role: 'bot', text: response }]);
      setIsTyping(false);
    }, 1200);
  };

  const sendDemoMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const input = userInput.trim();
    if (!input || isTyping) return;
    processMessage(input);
  };

  const [modalContent, setModalContent] = useState('');

  const handleLinkClick = (e: React.MouseEvent, content: string) => {
    const href = (e.currentTarget as HTMLAnchorElement).getAttribute('href');
    if (href && href.startsWith('#') && href.length > 1) {
      // Allow anchor navigation
      return;
    }
    e.preventDefault();
    const target = e.currentTarget as HTMLElement;
    const label = (target.innerText || content).trim();
    
    if (label === 'Get started' || label === 'Get your chatbot' || label === 'Try for free') {
        setModalContent('ONBOARDING');
        setIsModalOpen(true);
        return;
    }
    
    if (label === 'Demo' || label === 'See demo') {
        setIsDemoOpen(true);
        return;
    }

    if (label === 'Pricing') {
        const el = document.getElementById('pricing');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    if (label === 'How it works') {
        const el = document.getElementById('how-it-works');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    setModalContent("Information about " + label + " will be available soon!");
    setIsModalOpen(true);
  };

  const [onboardingStep, setOnboardingStep] = useState(0);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const businessName = formData.get('business_name') as string;
    const userEmail = formData.get('user_email') as string;
    const userName = formData.get('user_name') as string;

    const signupData = {
        name: businessName,
        subdomain: businessName.toLowerCase().replace(/[^a-z0-9]/g, ''),
        email: userEmail,
        plan: "free"
    };

    setOnboardingStep(1);
    
    // Simulate AI Onboarding
    setTimeout(() => setOnboardingStep(2), 1500);
    setTimeout(() => setOnboardingStep(3), 3000);

    // Actual Backend Registration & Email Dispatch
    try {
        const response = await fetch('http://localhost:8000/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(signupData)
        });

        if (!response.ok) throw new Error('Signup failed');
        
        console.log('INTEGRATION_SUCCESS: Lead registered and email dispatched via backend.');
    } catch {
        console.warn('INTEGRATION_NOTICE: Backend registration failed. Ensure the FastAPI server is running on port 8000.');
    }

    setTimeout(() => {
        setIsModalOpen(false);
        setOnboardingStep(0);
        setModalContent(`Welcome ${userName}! Your AI dashboard for ${businessName} is being provisioned. Check your email (${userEmail}) for the confirmation.`);
        setIsModalOpen(true);
    }, 4500);
  };
  return (
    <>
      <style>{`
        .nav.is-accent-primary {
            background-color: rgba(10, 10, 10, 0.85) !important;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
            height: 80px;
            display: flex;
            align-items: center;
        }
        .nav_container {
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .nav_link {
            color: #a1a1aa !important;
            transition: color 0.3s;
        }
        .nav_link:hover {
            color: white !important;
        }
        .nav_logo {
            display: flex;
            align-items: center;
            gap: 12px;
            white-space: nowrap;
            flex-shrink: 0;
            text-decoration: none;
        }
        .nav_logo-icon {
            width: 32px;
            height: 32px;
            color: #BB00FF;
        }
        .modal_input {
            width: 100%;
            padding: 14px;
            border-radius: 10px;
            border: 1px solid #e5e7eb;
            background: #f9fafb;
            color: #1a1a1a;
            font-size: 14px;
            outline: none;
            transition: all 0.3s;
        }
        .modal_input:focus {
            border-color: #BB00FF;
            background: white;
            box-shadow: 0 0 0 4px rgba(187, 0, 255, 0.1);
        }
        .button.on-accent-primary {
            background-color: #BB00FF !important;
            color: white !important;
            font-weight: 700 !important;
            transition: all 0.3s !important;
        }
        .button.on-accent-primary:hover {
            background-color: #d100ff !important;
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(187, 0, 255, 0.2);
        }
        .logo-link {
            display: flex;
            align-items: center;
            gap: 12px;
            white-space: nowrap;
            text-decoration: none;
        }
        .heading_primary_modal {
            font-size: 2rem !important;
            font-weight: 900 !important;
            letter-spacing: -0.04em !important;
            line-height: 1.1 !important;
        }
      `}</style>
      <div className="nav is-accent-primary">
        <div
          data-duration="400"
          data-animation="default"
          data-easing2="ease"
          data-easing="ease"
          data-collapse="medium"
          role="banner"
          data-no-scroll="1"
          className="nav_container w-nav"
        >
          <div className="nav_left">
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: "smooth"}); }} className="nav_logo w-inline-block">
              <div className="nav_logo-icon" style={{ width: '28px', height: '28px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 33 33"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div
                data-brand-name="true"
                className="paragraph_large margin-bottom_none"
                style={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'white' }}
              >
                ChatBoost <span style={{ color: '#BB00FF', opacity: 0.8 }}>by Shinju AI</span>
              </div>
            </a>
          </div>
          <div className="nav_right">
            <nav role="navigation" className="nav_menu w-nav-menu">
              <ul role="list" className="nav_menu-list w-list-unstyled">
                <li className="nav_menu-list-item">
                  <div
                    data-delay="0"
                    data-hover="false"
                    className="nav_dropdown-menu w-dropdown"
                  >
                    <div className="nav_link on-accent-primary w-dropdown-toggle">
                      <div>Solutions</div>
                      <div className="nav_caret w-icon-dropdown-toggle"></div>
                    </div>
                    <nav className="mega-nav_dropdown-list w-dropdown-list">
                      <div className="mega-nav_dropdown-list-wrapper">
                        <ul
                          role="list"
                          className="grid_3-col tablet-1-col-1 gap-medium margin-bottom_none w-list-unstyled"
                        >
                          <li
                            id="w-node-_84f45f61-ef41-482d-a6f9-d55298effd85-ad6d2e56"
                            className="grid-item-manual w-node-a17d5ce7-8b58-2840-476b-f984f1586f3b-31ca503b"
                          >
                            <div className="w-layout-grid grid_3-col tablet-1-col-1 gap-small">
                              <div className="grid-item-manual">
                                <div className="eyebrow">For businesses</div>
                                <ul
                                  role="list"
                                  className="mega-nav_list w-list-unstyled"
                                >
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effd90-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586ecb-31ca503b"
                                      >
                                        <div>
                                          <strong>Customer chatbots</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Automate replies and boost
                                            engagement.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effd9c-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586ed7-31ca503b"
                                      >
                                        <div>
                                          <strong>Order automation</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Take orders directly from your site.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effda8-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586ee3-31ca503b"
                                      >
                                        <div>
                                          <strong>Social messaging</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Connect on WhatsApp and Instagram.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="grid-item-manual">
                                <div className="eyebrow">By industry</div>
                                <ul
                                  role="list"
                                  className="mega-nav_list w-list-unstyled"
                                >
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdb8-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586ef3-31ca503b"
                                      >
                                        <div>
                                          <strong>Restaurants</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Answer questions and take
                                            reservations.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdc4-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586f01-31ca503b"
                                      >
                                        <div>
                                          <strong>Salons &amp; spas</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Book appointments and manage
                                            clients.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#features" onClick={(e) => handleLinkClick(e, "Features")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdd0-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586f0d-31ca503b"
                                      >
                                        <div>
                                          <strong>Retail shops</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Handle inquiries and drive sales.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="grid-item-manual">
                                <div className="eyebrow">Resources</div>
                                <ul
                                  role="list"
                                  className="mega-nav_list w-list-unstyled"
                                >
                                  <li>
                                    <a
                                      href="#how-it-works" onClick={(e) => handleLinkClick(e, "How it works")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effde0-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586f1d-31ca503b"
                                      >
                                        <div>
                                          <strong>How it works</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            See our simple 3-step process.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#pricing" onClick={(e) => handleLinkClick(e, "Pricing")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdec-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586f29-31ca503b"
                                      >
                                        <div>
                                          <strong>Pricing</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Compare plans for your needs.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      href="#" onClick={(e) => handleLinkClick(e, "Demo")} 
                                      className="mega-nav_link-item w-inline-block"
                                    >
                                      <div className="nav_icon is-medium">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 32 32"
                                          fill="currentColor"
                                        >
                                          <path
                                            d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                      <div
                                        id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdf8-ad6d2e56"
                                        className="content-block w-node-a17d5ce7-8b58-2840-476b-f984f1586f35-31ca503b"
                                      >
                                        <div>
                                          <strong>Demo</strong>
                                        </div>
                                        <div className="text-color_primary">
                                          <div className="paragraph_small text-color_secondary">
                                            Try our chatbot in action.
                                          </div>
                                        </div>
                                      </div>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </li>
                          <li
                            id="w-node-_84f45f61-ef41-482d-a6f9-d55298effdff-ad6d2e56"
                            className="grid-item-manual w-node-a17d5ce7-8b58-2840-476b-f984f1586f4a-31ca503b"
                          >
                            <a
                              href="#" onClick={(e) => handleLinkClick(e, "See demo")} 
                              className="card-link is-inverse on-accent-primary w-inline-block"
                            >
                              <div className="card_body">
                                <div className="heading_tertiary">
                                  Boost sales with AI chatbots
                                </div>
                                <p className="paragraph_small text-color_inverse-secondary">
                                  Discover how automated chat can grow your
                                  business and save you time.
                                </p>
                                <div className="margin_top-auto">
                                  <div className="button-group">
                                    <div className="text-button is-secondary on-accent-primary">
                                      <div>See demo</div>
                                      <div className="button_icon">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          width="100%"
                                          height="100%"
                                          viewBox="0 0 16 16"
                                          fill="none"
                                        >
                                          <path
                                            d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinejoin="round"
                                          ></path>
                                        </svg>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                </li>
                <li className="nav_menu-list-item">
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="nav_link on-accent-primary w-inline-block"
                  >
                    <div>About</div>
                  </a>
                </li>
                <li className="nav_menu-list-item">
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="nav_link on-accent-primary w-inline-block"
                  >
                    <div>Blog</div>
                  </a>
                </li>
                <li className="nav_menu-list-item">
                  <div
                    data-delay="0"
                    data-hover="false"
                    className="nav_dropdown-menu w-dropdown"
                  >
                    <div className="nav_link on-accent-primary w-dropdown-toggle">
                      <div>Support</div>
                      <div className="nav_caret w-icon-dropdown-toggle"></div>
                    </div>
                    <div className="nav_dropdown-list-1 w-dropdown-list">
                      <div className="nav-menu_dropdown-list-wrapper">
                        <ul
                          role="list"
                          className="flex_vertical margin-bottom_none w-list-unstyled"
                        >
                          <li className="margin-bottom_none">
                            <a
                              href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                              className="nav_dropdown-link w-inline-block"
                            >
                              <div className="button_label">Help center</div>
                            </a>
                          </li>
                          <li className="margin-bottom_none">
                            <a
                              href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                              className="nav_dropdown-link w-inline-block"
                            >
                              <div className="button_label">Contact</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
            <div className="button-group margin-top_none">
              <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button on-accent-primary w-inline-block">
                <div className="button_label">Get started</div>
              </a>
            </div>
          </div>
          <div className="nav_mobile-menu-button w-nav-button">
            <div className="icon on-accent-primary">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <g
                  className="nc-icon-wrapper"
                  strokeLinecap="square"
                  strokeLinejoin="miter"
                  strokeWidth="1.5"
                  fill="none"
                  stroke="currentColor"
                  stroke-miterlimit="10"
                >
                  <line
                    x1="1"
                    y1="12"
                    x2="23"
                    y2="12"
                    stroke="currentColor"
                  ></line>
                  <line x1="1" y1="5" x2="23" y2="5"></line>
                  <line x1="1" y1="19" x2="23" y2="19"></line>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <header style={{minHeight: "80vh", paddingTop: "120px"}} className="section">
        <div className="container">
          <div className="w-layout-grid grid_2-col tablet-1-col-1-2 gap-xxlarge is-y-center">
            <div className="grid-item-manual">
              <div className="image-ratio_1x1">
                <img
                  width="1216"
                  height="832"
                  alt="[interface] image of a laptop with software interface (for an ai marketing tech company)"
                  src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff311_ba0ffe8d-8c5e-4afc-8438-436c86e29e22.avif"
                  loading="lazy"
                  className="image_cover"
                />
              </div>
            </div>
            <div className="header margin-bottom_none">
              <h1 className="heading_hero">24/7 sales, powered by Shinju AI</h1>
              <div className="subheading rich-text w-richtext">
                <p>
                  Custom chatbots that answer customers, take orders, and boost
                  your revenue automatically.
                </p>
              </div>
              <div className="tag-group gap-small">
                <div className="flex_horizontal is-y-center gap-xxsmall">
                  <div className="icon">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M4 12C8.41828 12 12 8.41828 12 4C12 8.41828 15.5817 12 20 12C15.5817 12 12 15.5817 12 20C12 15.5817 8.41828 12 4 12Z"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div>Automated customer replies</div>
                </div>
                <div className="flex_horizontal is-y-center gap-xxsmall">
                  <div className="icon">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9.24998 18.7103C6.60958 17.6271 4.75 15.0307 4.75 12C4.75 8.96938 6.60958 6.37304 9.24997 5.28979"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M14.75 5.28979C17.3904 6.37303 19.25 8.96938 19.25 12.0001C19.25 15.0307 17.3904 17.6271 14.75 18.7103"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M4 19.2501L8.99998 19.2501C9.13805 19.2501 9.24998 19.1381 9.24998 19.0001L9.24997 14"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                      <path
                        d="M20 4.75L15 4.75003C14.8619 4.75003 14.75 4.86196 14.75 5.00003L14.75 10.0001"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div>Order taking &amp; booking</div>
                </div>
                <div className="flex_horizontal is-y-center gap-xxsmall">
                  <div className="icon">
                    <svg
                      width="100%"
                      height="100%"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M17.3654 5.32894C17.8831 5.54543 18.3534 5.86273 18.7495 6.26274C19.146 6.6625 19.4604 7.13723 19.675 7.65978C19.8895 8.18233 20 8.74246 20 9.30814C20 9.87384 19.8895 10.4339 19.675 10.9565C19.4604 11.4791 19.146 11.9538 18.7495 12.3535L12.0001 19L5.2496 12.3535C4.44951 11.5457 4 10.4501 4 9.3076C4 8.16516 4.44951 7.0695 5.2496 6.26166C6.04975 5.45384 7.13498 5 8.26647 5C9.39804 5 10.4833 5.45384 11.2833 6.26166L12.016 6.99843L12.7158 6.26274C13.112 5.86273 13.5823 5.54543 14.0999 5.32894C14.6176 5.11246 15.1724 5.00103 15.7327 5.00103C16.2929 5.00103 16.8478 5.11246 17.3654 5.32894Z"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                        stroke="currentColor"
                      ></path>
                    </svg>
                  </div>
                  <div>Works on any platform</div>
                </div>
              </div>
              <div className="button-group">
                <div className="ix-link-wrapper">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Get your chatbot
                  </a>
                </div>
                <div className="ix-link-wrapper">
                  <a href="#" onClick={() => setIsDemoOpen(true)} className="button is-secondary w-button">
                    See demo
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <section style={{minHeight: "80vh"}} className="section padding-vertical_medium">
        <div className="container">
          <div className="flex_horizontal is-wrap gap-medium is-x-center">
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M19.4,5.4h1.3v5.1h4v1.1h-5.3v-6.2ZM25,8.5c0-1.8,1.3-3.2,4-3.2s4,1.4,4,3.2-1.2,3.2-4,3.2-4-1.3-4-3.2ZM31.7,8.5c0-1.2-.9-2.2-2.7-2.2s-2.7,1-2.7,2.2.9,2.2,2.7,2.2,2.7-1,2.7-2.2ZM33.8,8.6c0-1.8,1.3-3.3,3.9-3.3s3.5,1.2,3.5,2.3,0,0,0,.2h-1.2c0,0,0,0,0-.1,0-.6-.6-1.4-2.3-1.4s-2.6,1-2.6,2.3.8,2.2,2.6,2.2,2.2-.8,2.2-1.4h0s-2.5,0-2.5,0v-.8h3.8v3.1h-1.1c0-.2,0-.8,0-1.3h0c-.3.9-1.2,1.4-2.6,1.4-2.7,0-3.7-1.5-3.7-3.1ZM42.2,8.5c0-1.8,1.3-3.2,4-3.2s4,1.4,4,3.2-1.2,3.2-4,3.2-4-1.3-4-3.2ZM48.8,8.5c0-1.2-.9-2.2-2.7-2.2s-2.7,1-2.7,2.2.9,2.2,2.7,2.2,2.7-1,2.7-2.2ZM16.3,8.5c0,1.2-.3,2.2-.8,3.1-.5.9-1.3,1.6-2.3,2.1-1,.5-2.2.8-3.6.8s-2.5-.2-3.5-.7c-1-.5-1.8-1.2-2.4-2.1s-.9-1.9-.9-3.2.3-2.2.8-3.1c.5-.9,1.3-1.6,2.3-2.1,1-.5,2.2-.8,3.6-.8s2.5.2,3.5.7c1,.5,1.8,1.2,2.4,2.1s.9,1.9.9,3.2ZM15,8.5c0-1-.2-1.8-.6-2.5-.4-.7-1-1.3-1.9-1.7-.8-.4-1.8-.6-2.9-.6s-2,.2-2.8.6c-.8.4-1.4.9-1.9,1.6-.4.7-.7,1.6-.7,2.6s.2,1.8.6,2.5c.4.7,1,1.3,1.9,1.7.8.4,1.8.6,2.9.6s2-.2,2.8-.6,1.4-.9,1.9-1.6c.4-.7.7-1.6.7-2.6ZM13,9.5c-.1.8-.5,1.3-1.1,1.7s-1.3.6-2.2.6-1.9-.3-2.6-.9c-.6-.6-1-1.4-1-2.4s.1-1.2.4-1.7c.3-.5.7-.9,1.2-1.2.5-.3,1.2-.4,1.9-.4,1.7,0,2.7.7,3.1,2.1l-1.4.2c-.1-.4-.4-.7-.6-.9s-.7-.3-1.2-.3-1.2.2-1.6.6c-.4.4-.6.9-.6,1.6s.2,1.3.5,1.6c.4.4.9.6,1.6.6s1,0,1.3-.3c.3-.2.5-.5.6-.9h1.4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M17.4,5.4h5.8v1h-4.5v1.6h3.5v.8h-3.5v1.7h4.5v1h-5.8v-6.2ZM23.8,8.6c0-1.8,1.3-3.3,3.9-3.3s3.5,1.2,3.5,2.3,0,0,0,.2h-1.2c0,0,0,0,0-.1,0-.6-.6-1.4-2.3-1.4s-2.6,1-2.6,2.3.8,2.2,2.6,2.2,2.2-.8,2.2-1.4h0s-2.5,0-2.5,0v-.8h3.8v3.1h-1.1c0-.2,0-.8,0-1.3h0c-.3.9-1.2,1.4-2.6,1.4-2.7,0-3.7-1.5-3.7-3.1ZM32.1,8.6c0-1.8,1.3-3.3,3.9-3.3s3.5,1.2,3.5,2.3,0,0,0,.2h-1.2c0,0,0,0,0-.1,0-.6-.6-1.4-2.3-1.4s-2.6,1-2.6,2.3.8,2.2,2.6,2.2,2.2-.8,2.2-1.4h0s-2.5,0-2.5,0v-.8h3.8v3.1h-1.1c0-.2,0-.8,0-1.3h0c-.3.9-1.2,1.4-2.6,1.4-2.7,0-3.7-1.5-3.7-3.1ZM40.5,9.5h1.2c0,.6.3,1.2,2.3,1.2s2.3-.5,2.3-1-.2-.5-.6-.6c-.4-.1-1.5-.1-2.2-.2-.8,0-1.8-.1-2.3-.4-.5-.2-.8-.7-.8-1.3,0-1.1,1.1-2,3.5-2s3.4,1,3.4,2.1h-1.2c0-.7-.5-1.2-2.2-1.2s-2.2.4-2.2,1,.2.5.5.6c.4.1,1.4.2,2.1.2.9,0,1.8.1,2.3.3.6.2.9.7.9,1.3,0,.9-.5,2.1-3.6,2.1s-3.5-1.4-3.5-2.2ZM13,5.7l-3.1,1.3,1.8-3.7c-.9-1.1-2-1.8-3.1-1.8-2.8,0-5,3.8-5,7.3s2.2,5.5,5,5.5,5-1.9,5-5.5-.2-2.1-.6-3.1Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M24.4,5.4h2.6c1.5,0,2.4.8,2.4,2.2s-.8,2.1-2.3,2.1h-1.6v1.9h-1.1v-6.2ZM27,8.9c.8,0,1.3-.4,1.3-1.3s-.5-1.3-1.4-1.3h-1.4v2.5h1.5ZM33.8,10.2h-2.9l-.5,1.4h-1.2l2.5-6.2h1.4l2.5,6.2h-1.3l-.5-1.4ZM33.5,9.4l-1.1-3.1h0l-1.2,3.1h2.3ZM40.6,10.2h-2.9l-.5,1.4h-1.2l2.5-6.2h1.4l2.5,6.2h-1.3l-.5-1.4ZM40.3,9.4l-1.1-3.1h0l-1.2,3.1h2.3ZM43.3,5.4h1.1v3.4h0l3.3-3.4h1.4l-2.7,2.8,2.9,3.4h-1.5l-2.2-2.6-1.2,1.1v1.5h-1.1v-6.2ZM4.9,6.3h-1.9v-.9h5v.9h-1.9v5.3h-1.1v-5.3ZM8.7,5.4h1.1v2.5h3.3v-2.5h1.1v6.2h-1.1v-2.8h-3.3v2.8h-1.1v-6.2ZM15.5,5.4h4.2v.9h-3.1v1.8h2.5v.7h-2.5v1.8h3.2v.9h-4.3v-6.2ZM51.6,14.1h-30V2.6h30v11.5ZM22.6,13.1h28V3.6h-28v9.5Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M22,4.7h1.4v6.9h-1.4v-6.9ZM24.9,4.7h3.4c3.2,0,4.3,1.6,4.3,3.4s-1.1,3.4-4,3.4h-3.7v-6.9ZM28.5,10.5c1.8,0,2.6-.8,2.6-2.3s-.6-2.3-2.8-2.3h-2v4.6h2.2ZM33.7,4.7h6.4v1.1h-5v1.8h3.9v.9h-3.9v1.9h5.1v1.1h-6.5v-6.9ZM48,10.1h-4.7l-.9,1.5h-1.5l4-6.9h1.7l4,6.9h-1.7l-.9-1.5ZM47.5,9.1l-1.8-3.2h0l-1.8,3.2h3.7ZM2.6,2.7v11.1h15.1V2.7H2.6ZM10.1,12.6c-3.6,0-6.5-1.9-6.5-4.3s2.9-4.3,6.5-4.3,6.5,1.9,6.5,4.3-2.9,4.3-6.5,4.3Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M16.1,9.4c0-.2,0-.4,0-.5h1.1c0,.2,0,.3,0,.3,0,.8.5,1.3,1.5,1.3s1.6-.5,1.6-1.2-.4-.8-1.1-.8h-1v-.8h.9c.7,0,1-.4,1-.9s-.5-1.1-1.3-1.1-1.4.5-1.4,1.2,0,.3,0,.4h-1c0-.1,0-.3,0-.6,0-1.2.9-2,2.5-2s2.3.7,2.3,1.9-.3,1.2-.9,1.3h0c.8.2,1.2.7,1.2,1.5,0,1.3-1,2.1-2.7,2.1s-2.6-.8-2.6-2.1ZM22.1,8.2c0-2.1,1-3.4,2.8-3.4s2.3.8,2.3,2,0,.3,0,.4h-1.1c0-.1,0-.2,0-.3,0-.7-.4-1.1-1.2-1.1s-1.6.9-1.6,2.4v.5h0c.1-.7.8-1.1,1.8-1.1,1.5,0,2.3.7,2.3,1.8s-1,2.1-2.6,2.1-2.8-1.2-2.8-3.4ZM26.3,9.4c0-.6-.5-1-1.4-1s-1.5.4-1.5,1c0,.7.7,1.1,1.5,1.1s1.4-.5,1.4-1.2ZM28.2,8.1c0-2.1.9-3.4,2.7-3.4s2.7,1.3,2.7,3.4-.9,3.4-2.7,3.4-2.7-1.3-2.7-3.4ZM32.4,8.1c0-1.5-.5-2.4-1.5-2.4s-1.5.9-1.5,2.4.5,2.4,1.5,2.4,1.5-.9,1.5-2.4ZM34.5,4.8h1.2v5.6h3.3v1h-4.5v-6.6ZM44.4,9.9h-3.1l-.6,1.5h-1.2l2.7-6.6h1.5l2.7,6.6h-1.4l-.6-1.5ZM44,9.1l-1.2-3.3h0l-1.2,3.3h2.5ZM47.2,4.8h2.8c1.5,0,2.3.7,2.3,1.7s-.4,1.3-1.1,1.4h0c.8.1,1.3.7,1.3,1.5s-.7,1.9-2.4,1.9h-3v-6.6ZM50.1,7.6c.8,0,1.2-.3,1.2-.9s-.4-1-1.3-1h-1.6v1.9h1.7ZM50.2,10.5c.9,0,1.2-.4,1.2-1.1s-.5-1-1.3-1h-1.8v2h1.8ZM6.9,14.1c-3.2,0-5.9-2.6-5.9-5.9S3.7,2.3,6.9,2.3s5.9,2.6,5.9,5.9-2.6,5.9-5.9,5.9ZM6.9,3.4c-2.6,0-4.8,2.2-4.8,4.8s2.2,4.8,4.8,4.8,4.8-2.2,4.8-4.8-2.2-4.8-4.8-4.8ZM6.9,11.4c-1.8,0-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2,3.2,1.4,3.2,3.2-1.4,3.2-3.2,3.2ZM6.9,6.1c-1.2,0-2.1,1-2.1,2.1s1,2.1,2.1,2.1,2.1-1,2.1-2.1-1-2.1-2.1-2.1Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
            <div className="logo">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="100%"
                height="100%"
                viewBox="0 0 54 16"
                fill="none"
              >
                <path
                  d="M13,4.5h4.5v1h-3.3v1.9h2.6v.8h-2.6v1.9h3.4v1h-4.6v-6.6ZM18.2,7.8c0-2.1,1.4-3.4,3.4-3.4s3,1,3,2.6,0,.2,0,.3h-1.1c0,0,0-.2,0-.2,0-1-.8-1.7-1.9-1.7s-2.2.9-2.2,2.4,1,2.4,2.2,2.4,1.9-.6,1.9-1.6v-.2h1.1v.2c0,1.5-1.2,2.5-3,2.5s-3.4-1.3-3.4-3.4ZM25.6,4.5h1.2v2.7h3.5v-2.7h1.2v6.6h-1.2v-2.9h-3.5v2.9h-1.2v-6.6ZM32.6,7.8c0-2.1,1.5-3.4,3.4-3.4s3.4,1.3,3.4,3.4-1.5,3.4-3.4,3.4-3.4-1.3-3.4-3.4ZM38.2,7.8c0-1.5-1-2.4-2.2-2.4s-2.2.9-2.2,2.4,1,2.4,2.2,2.4,2.2-.9,2.2-2.4ZM40.5,4.5h4.5v1h-3.3v1.9h2.6v.8h-2.6v1.9h3.4v1h-4.6v-6.6ZM45.8,8.9h1.1c0,.8.4,1.4,1.7,1.4s1.7-.5,1.7-1-.2-.6-.5-.7c-.3-.1-1-.2-1.6-.3-.7,0-1.4-.2-1.7-.5-.4-.3-.7-.7-.7-1.3,0-1.2,1-2,2.8-2s2.7.9,2.7,2.4h-1.1c0-1-.5-1.4-1.6-1.4s-1.6.4-1.6,1,.1.6.4.7c.3.1,1,.3,1.6.3.7.1,1.3.2,1.7.4.5.2.7.7.7,1.3,0,1.1-.6,2.1-2.9,2.1s-2.8-1.2-2.8-2.4ZM9.9,6.2h-5c-.7,0-1.2-.5-1.2-1.2s.5-1.2,1.2-1.2h1.3v-1.2h-1.3c-1.3,0-2.4,1.1-2.4,2.4s1.1,2.4,2.4,2.4h5v-1.2ZM10,11.1c0-1.3-1.1-2.4-2.4-2.4H2.6v1.2h5c.7,0,1.2.5,1.2,1.2s-.5,1.2-1.2,1.2h-1.3v1.2h1.3c1.3,0,2.4-1.1,2.4-2.4Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </section>
      <section id="how-it-works" style={{minHeight: "80vh"}} className="section">
        <div className="container">
          <div className="header is-align-center">
            <p className="eyebrow">Seamless integration</p>
            <h2 className="heading_primary">How it works</h2>
          </div>
          <div className="w-layout-grid grid_3-col gap-large tablet-1-col-1">
            <div className="content-block" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(187, 0, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 900, color: '#BB00FF' }}>1</div>
              <h3 className="heading_small">Connect your data</h3>
              <p className="paragraph_small">Upload your menu, FAQ, or documentation. Our AI indexes your business logic in seconds.</p>
            </div>
            <div className="content-block" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(187, 0, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 900, color: '#BB00FF' }}>2</div>
              <h3 className="heading_small">Customize the brain</h3>
              <p className="paragraph_small">Set your tone of voice and specific rules. Your chatbot becomes an extension of your team.</p>
            </div>
            <div className="content-block" style={{ textAlign: 'center' }}>
              <div style={{ width: '80px', height: '80px', background: 'rgba(187, 0, 255, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 900, color: '#BB00FF' }}>3</div>
              <h3 className="heading_small">Go live everywhere</h3>
              <p className="paragraph_small">Embed the widget on your site or link it to WhatsApp and Instagram. Start boosting sales instantly.</p>
            </div>
          </div>
        </div>
      </section>
      <section id="features" style={{minHeight: "80vh"}} className="section is-secondary">
        <div className="container">
          <div className="w-layout-grid header is-2-col">
            <div
              id="w-node-_1ca8f686-c0f9-8145-7d1f-2aa2b2b02544-f6446cec"
              className="grid-item-manual w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8114-4c46e22b"
            >
              <h2 className="heading_primary">
                Smarter customer conversations, less effort
              </h2>
            </div>
            <div
              id="w-node-_1ca8f686-c0f9-8145-7d1f-2aa2b2b02547-f6446cec"
              className="grid-item-manual w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8118-4c46e22b"
            >
              <div className="subheading w-richtext">
                <p>
                  Automate replies, bookings, and sales with AI chatbots built
                  for local businesses.
                </p>
              </div>
            </div>
          </div>
          <div
            id="w-node-_819bded7-04a6-bcd9-8507-e345f6446cf4-f6446cec"
            data-easing="ease"
            data-current="Tab 1"
            data-duration-out="100"
            data-duration-in="300"
            className="w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81a8-4c46e22b w-tabs"
          >
            <div className="tabs_nav gap-xxsmall w-tab-menu">
              <a
                data-w-tab="Tab 1"
                className="tab_menu-button w-tab-link w--current"
              >
                <div>Features</div>
              </a>
              <a onClick={() => setActiveTab("Tab 2")} className={"tab_menu-button w-tab-link " + (activeTab === "Tab 2" ? "w--current" : "")}>
                <div>Integrations</div>
              </a>
            </div>
            <div className="tabs_content w-tab-content">
              <div className={"w-tab-pane " + (activeTab === "Tab 1" ? "w--tab-active" : "")}>
                <div className="w-layout-grid grid_3-col gap-xsmall">
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12.5 18.25C16.2279 18.25 19.25 15.2279 19.25 11.5C19.25 7.77208 16.2279 4.75 12.5 4.75C8.77208 4.75 5.75 7.77208 5.75 11.5C5.75 12.6007 6.01345 13.6398 6.48072 14.5578L5 19L9.71819 17.6519C10.5664 18.0361 11.5082 18.25 12.5 18.25Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-_4b0a2c19-da60-f3bd-4148-a134f9ac5edd-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8125-4c46e22b"
                        >
                          Automated customer replies
                        </h3>
                        <p className="paragraph_small">
                          Respond instantly to questions and free up your team
                          with AI-powered answers.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>Learn more</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M4 12C8.41828 12 12 8.41828 12 4C12 8.41828 15.5817 12 20 12C15.5817 12 12 15.5817 12 20C12 15.5817 8.41828 12 4 12Z"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                              stroke="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-ecc7dbe4-b05c-ca2a-6527-420e49b7a543-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc813b-4c46e22b"
                        >
                          Order taking &amp; booking
                        </h3>
                        <p className="paragraph_small">
                          Let customers order or book anytime, right in chat—no
                          waiting.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>Learn more</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            ></path>
                            <path
                              d="M9 12L11 14L15.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-_138081de-745d-26d3-5f8f-33c8fdff59ef-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8152-4c46e22b"
                        >
                          Works everywhere you need
                        </h3>
                        <p className="paragraph_small">
                          Connect to your website, WhatsApp, and Instagram for
                          seamless support.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>Learn more</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
              <div className={"w-tab-pane " + (activeTab === "Tab 2" ? "w--tab-active" : "")}>
                <div className="w-layout-grid grid_3-col gap-xsmall">
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M12.5 18.25C16.2279 18.25 19.25 15.2279 19.25 11.5C19.25 7.77208 16.2279 4.75 12.5 4.75C8.77208 4.75 5.75 7.77208 5.75 11.5C5.75 12.6007 6.01345 13.6398 6.48072 14.5578L5 19L9.71819 17.6519C10.5664 18.0361 11.5082 18.25 12.5 18.25Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-_4274966d-7137-4198-9cb5-998a5aa4ef1c-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8168-4c46e22b"
                        >
                          Website integration made easy
                        </h3>
                        <p className="paragraph_small">
                          Add your chatbot in minutes—no code needed. Start
                          chatting right away.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>See how</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M4 12C8.41828 12 12 8.41828 12 4C12 8.41828 15.5817 12 20 12C15.5817 12 12 15.5817 12 20C12 15.5817 8.41828 12 4 12Z"
                              strokeWidth="1.5"
                              strokeLinejoin="round"
                              stroke="currentColor"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-_4274966d-7137-4198-9cb5-998a5aa4ef2f-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8180-4c46e22b"
                        >
                          WhatsApp &amp; Instagram ready
                        </h3>
                        <p className="paragraph_small">
                          Support and sell on the messaging apps your customers
                          use most.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>See how</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                  <div className="ix-link-wrapper">
                    <a
                      href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                      className="card-link height_100percent on-secondary w-inline-block"
                    >
                      <div className="card_body">
                        <div className="icon is-background margin-bottom_xsmall">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M19.25 12C19.25 16.0041 16.0041 19.25 12 19.25C7.99594 19.25 4.75 16.0041 4.75 12C4.75 7.99594 7.99594 4.75 12 4.75C16.0041 4.75 19.25 7.99594 19.25 12Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            ></path>
                            <path
                              d="M9 12L11 14L15.5 9.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            ></path>
                          </svg>
                        </div>
                        <h3
                          id="w-node-_4274966d-7137-4198-9cb5-998a5aa4ef43-f6446cec"
                          className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8195-4c46e22b"
                        >
                          Custom-trained for your business
                        </h3>
                        <p className="paragraph_small">
                          Every chatbot is tailored to your menu, services, and
                          FAQs for accurate answers.
                        </p>
                        <br />
                        <p></p>
                        <div className="margin_top-auto">
                          <div className="button-group">
                            <div className="text-button is-secondary">
                              <div>See how</div>
                              <div className="button_icon">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="100%"
                                  height="100%"
                                  viewBox="0 0 16 16"
                                  fill="none"
                                >
                                  <path
                                    d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinejoin="round"
                                  ></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="results" style={{minHeight: "80vh"}} className="section">
        <div className="container">
          <div className="header">
            <div className="eyebrow">See the impact in numbers</div>
            <h2 className="heading_primary">
              Results that speak for themselves
            </h2>
          </div>
          <div
            id="w-node-a30e14a1-7c16-0bc1-d66b-80a6c47484b8-c47484b3"
            className="w-layout-grid grid_3-col gap-medium w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81bf-4c46e22b"
          >
            <div
              id="w-node-a30e14a1-7c16-0bc1-d66b-80a6c47484b9-c47484b3"
              className="content-block w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81b4-4c46e22b"
            >
              <div className="paragraph_large margin-bottom_none text-color_muted">
                Higher response rates
              </div>
              <div className="heading_hero">40%</div>
            </div>
            <div
              id="w-node-a30e14a1-7c16-0bc1-d66b-80a6c47484be-c47484b3"
              className="content-block w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81b9-4c46e22b"
            >
              <div className="paragraph_large margin-bottom_none text-color_muted">
                Faster customer replies
              </div>
              <div className="heading_hero">32%</div>
            </div>
            <div
              id="w-node-a30e14a1-7c16-0bc1-d66b-80a6c47484c3-c47484b3"
              className="content-block w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81be-4c46e22b"
            >
              <div className="paragraph_large margin-bottom_none text-color_muted">
                Businesses powered since
              </div>
              <div className="heading_hero">2014</div>
            </div>
          </div>
        </div>
      </section>
      <section id="pricing" style={{minHeight: "80vh"}} className="section">
        <div className="container">
          <div className="header is-align-center">
            <p className="eyebrow">Flexible plans for every business</p>
            <h2 className="heading_primary">Pricing that scales with you</h2>
          </div>
          <div className="w-layout-grid grid_3-col gap-medium tablet-1-col-1">
            <div className="card-link height_100percent on-secondary" style={{ padding: '40px', borderRadius: '24px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
              <div className="eyebrow">Starter</div>
              <div className="heading_hero" style={{ fontSize: '3rem', margin: '20px 0' }}>$49<span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', flex: 1 }}>
                <li style={{ marginBottom: '15px' }}>✅ 1 AI Chatbot</li>
                <li style={{ marginBottom: '15px' }}>✅ 500 Messages / mo</li>
                <li style={{ marginBottom: '15px' }}>✅ Standard FAQ Logic</li>
                <li style={{ marginBottom: '15px' }}>✅ Web Widget Integration</li>
              </ul>
              <button onClick={() => { setModalContent('ONBOARDING'); setIsModalOpen(true); }} className="button w-button" style={{ width: '100%' }}>Get Started</button>
            </div>
            <div className="card-link height_100percent on-accent-primary" style={{ padding: '40px', borderRadius: '24px', border: '2px solid #BB00FF', display: 'flex', flexDirection: 'column', position: 'relative', background: '#fff', boxShadow: '0 20px 40px rgba(187, 0, 255, 0.1)' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '20px', background: '#BB00FF', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '12px', fontWeight: 900 }}>MOST POPULAR</div>
              <div className="eyebrow" style={{ color: '#BB00FF' }}>Professional</div>
              <div className="heading_hero" style={{ fontSize: '3rem', margin: '20px 0' }}>$199<span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', flex: 1 }}>
                <li style={{ marginBottom: '15px' }}>✅ Advanced RAG (Knowledge Base)</li>
                <li style={{ marginBottom: '15px' }}>✅ 5,000 Messages / mo</li>
                <li style={{ marginBottom: '15px' }}>✅ WhatsApp & Instagram</li>
                <li style={{ marginBottom: '15px' }}>✅ Lead Generation Dashboard</li>
                <li style={{ marginBottom: '15px' }}>✅ Priority Email Support</li>
              </ul>
              <button onClick={() => { setModalContent('ONBOARDING'); setIsModalOpen(true); }} className="button on-accent-primary w-button" style={{ width: '100%' }}>Get Started</button>
            </div>
            <div className="card-link height_100percent on-secondary" style={{ padding: '40px', borderRadius: '24px', border: '1px solid #eee', display: 'flex', flexDirection: 'column' }}>
              <div className="eyebrow">Enterprise</div>
              <div className="heading_hero" style={{ fontSize: '3rem', margin: '20px 0' }}>$499<span style={{ fontSize: '1rem', color: '#888' }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, marginBottom: '40px', flex: 1 }}>
                <li style={{ marginBottom: '15px' }}>✅ Unlimited Messages</li>
                <li style={{ marginBottom: '15px' }}>✅ Custom Multi-Agent Flow</li>
                <li style={{ marginBottom: '15px' }}>✅ White-Label Client Portal</li>
                <li style={{ marginBottom: '15px' }}>✅ dedicated Account Manager</li>
                <li style={{ marginBottom: '15px' }}>✅ SLA & Support Guarantee</li>
              </ul>
              <button onClick={() => { setModalContent('ONBOARDING'); setIsModalOpen(true); }} className="button w-button" style={{ width: '100%' }}>Contact Sales</button>
            </div>
          </div>
        </div>
      </section>
      <section id="stories" style={{minHeight: "80vh"}} className="section is-secondary">
        <div className="container">
          <div className="header is-align-center">
            <p className="eyebrow">See how businesses use AI chatbots</p>
            <h2 className="heading_primary">
              Real-world chatbot success stories
            </h2>
          </div>
          <div className="w-layout-grid grid_3-col gap-small">
            <div className="image-ratio_1x1" style={{ position: 'relative' }}>
              <img
                width="1216"
                height="832"
                alt="Shinju Bistro success story"
                src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff311_ba0ffe8d-8c5e-4afc-8438-436c86e29e22.avif"
                loading="lazy"
                className="image_cover"
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '12px' }}>
                <div style={{ color: '#BB00FF', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Shinju Bistro</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>300% Increase in order volume via AI Waiter.</div>
              </div>
            </div>
            <div className="image-ratio_1x1" style={{ position: 'relative' }}>
              <img
                width="1216"
                height="832"
                alt="Féau Real Estate chatbot"
                src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff34c_693dac7d-d942-4bbd-8839-d9545c0d6b43.avif"
                loading="lazy"
                className="image_cover"
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '12px' }}>
                <div style={{ color: '#00ff88', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Féau Immobilier</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>24/7 lead qualification for luxury properties.</div>
              </div>
            </div>
            <div className="image-ratio_1x1" style={{ position: 'relative' }}>
              <img
                width="1216"
                height="832"
                alt="AI Tutor success"
                src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff32f_2bc1e01d-d4eb-4d05-a2d4-6d37bc4c2620.avif"
                loading="lazy"
                className="image_cover"
              />
              <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '12px' }}>
                <div style={{ color: '#3b82f6', fontWeight: 900, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '5px' }}>Global Academy</div>
                <div style={{ color: 'white', fontSize: '14px', fontWeight: 700 }}>Instant answers for 10,000+ students daily.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="testimonial" style={{minHeight: "80vh"}} className="section">
        <div className="container">
          <div className="header">
            <h2 className="heading_primary">
              Real stories. Real business growth.
            </h2>
            <div className="rich-text subheading w-richtext">
              <p>
                Discover how small businesses use AI chatbots to save hours,
                increase bookings, and deliver faster customer support—day and
                night.
              </p>
            </div>
          </div>
          <div className="content-block">
            <div className="w-layout-grid grid_3-col tablet-1-col-1-2 gap-small">
              <div className="image-ratio_auto">
                <img
                  width="1216"
                  height="832"
                  alt="[interface] image of software interface (for a edtech)"
                  src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff325_37d9ec91-d5c5-4f76-b47c-a8e1a0ace159.avif"
                  loading="lazy"
                  className="image_cover"
                />
              </div>
              <div
                id="w-node-_6cc68828-c490-3740-2adb-a04dd10bcd55-a44a14d8"
                className="grid-item-manual w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81e2-4c46e22b"
              >
                <p className="quote is-large">
                  &quot;Our AI chatbot answers every question, even late at
                  night. We get more bookings and our guests are happier.&quot;
                </p>
                <div className="logo">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="100%"
                    viewBox="0 0 54 16"
                    fill="none"
                  >
                    <path
                      d="M16.1,9.4c0-.2,0-.4,0-.5h1.1c0,.2,0,.3,0,.3,0,.8.5,1.3,1.5,1.3s1.6-.5,1.6-1.2-.4-.8-1.1-.8h-1v-.8h.9c.7,0,1-.4,1-.9s-.5-1.1-1.3-1.1-1.4.5-1.4,1.2,0,.3,0,.4h-1c0-.1,0-.3,0-.6,0-1.2.9-2,2.5-2s2.3.7,2.3,1.9-.3,1.2-.9,1.3h0c.8.2,1.2.7,1.2,1.5,0,1.3-1,2.1-2.7,2.1s-2.6-.8-2.6-2.1ZM22.1,8.2c0-2.1,1-3.4,2.8-3.4s2.3.8,2.3,2,0,.3,0,.4h-1.1c0-.1,0-.2,0-.3,0-.7-.4-1.1-1.2-1.1s-1.6.9-1.6,2.4v.5h0c.1-.7.8-1.1,1.8-1.1,1.5,0,2.3.7,2.3,1.8s-1,2.1-2.6,2.1-2.8-1.2-2.8-3.4ZM26.3,9.4c0-.6-.5-1-1.4-1s-1.5.4-1.5,1c0,.7.7,1.1,1.5,1.1s1.4-.5,1.4-1.2ZM28.2,8.1c0-2.1.9-3.4,2.7-3.4s2.7,1.3,2.7,3.4-.9,3.4-2.7,3.4-2.7-1.3-2.7-3.4ZM32.4,8.1c0-1.5-.5-2.4-1.5-2.4s-1.5.9-1.5,2.4.5,2.4,1.5,2.4,1.5-.9,1.5-2.4ZM34.5,4.8h1.2v5.6h3.3v1h-4.5v-6.6ZM44.4,9.9h-3.1l-.6,1.5h-1.2l2.7-6.6h1.5l2.7,6.6h-1.4l-.6-1.5ZM44,9.1l-1.2-3.3h0l-1.2,3.3h2.5ZM47.2,4.8h2.8c1.5,0,2.3.7,2.3,1.7s-.4,1.3-1.1,1.4h0c.8.1,1.3.7,1.3,1.5s-.7,1.9-2.4,1.9h-3v-6.6ZM50.1,7.6c.8,0,1.2-.3,1.2-.9s-.4-1-1.3-1h-1.6v1.9h1.7ZM50.2,10.5c.9,0,1.2-.4,1.2-1.1s-.5-1-1.3-1h-1.8v2h1.8ZM6.9,14.1c-3.2,0-5.9-2.6-5.9-5.9S3.7,2.3,6.9,2.3s5.9,2.6,5.9,5.9-2.6,5.9-5.9,5.9ZM6.9,3.4c-2.6,0-4.8,2.2-4.8,4.8s2.2,4.8,4.8,4.8,4.8-2.2,4.8-4.8-2.2-4.8-4.8-4.8ZM6.9,11.4c-1.8,0-3.2-1.4-3.2-3.2s1.4-3.2,3.2-3.2,3.2,1.4,3.2,3.2-1.4,3.2-3.2,3.2ZM6.9,6.1c-1.2,0-2.1,1-2.1,2.1s1,2.1,2.1,2.1,2.1-1,2.1-2.1-1-2.1-2.1-2.1Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </div>
                <div className="padding-top_xsmall">
                  <div className="author_name">Taylor Kim</div>
                  <div className="author_info">Restaurant Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="team" style={{minHeight: "80vh"}} className="section is-secondary">
        <div className="container">
          <div className="w-layout-grid grid_3-col gap-medium is-y-top tablet-1-col-1-2">
            <div className="header margin-bottom_none">
              <div className="eyebrow">Our team</div>
              <h2 className="heading_primary">Experts behind your AI growth</h2>
              <div className="rich-text subheading w-richtext">
                <p>
                  Meet the specialists who design, build, and support your AI
                  chatbot—helping your business save time and boost sales.
                </p>
              </div>
              <div className="button-group">
                <div className="ix-link-wrapper">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Connect
                  </a>
                </div>
              </div>
            </div>
            <div
              id="w-node-_13528f8b-240a-53ee-2ce0-03bbb1c7c855-13171427"
              className="grid-item-manual w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8218-4c46e22b"
            >
              <div className="w-layout-grid grid_2-col gap-small">
                <div
                  id="w-node-e84efb56-5684-1086-a3a2-4f2cbc0961f2-13171427"
                  className="ix-link-wrapper w-node-cb4dba44-4d1a-628d-42f9-3215b3dc81fb-4c46e22b"
                >
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="content-block-link gap-xsmall w-inline-block"
                  >
                    <div className="image-ratio_3x4">
                      <img
                        width="1216"
                        height="832"
                        alt="image of a diverse group of professionals in a meeting room for a digital marketing &amp; advertising agency"
                        src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff30b_983c1e8a-9b04-4f37-8c32-e4a17e899feb.avif"
                        loading="lazy"
                        className="image_cover position_relative"
                      />
                    </div>
                    <div className="content-block">
                      <div className="heading_xsmall">Mohamed Traore</div>
                      <div className="author_info">Founder & Lead Architect</div>
                    </div>
                  </a>
                </div>
                <div
                  id="w-node-_28162eb4-b464-e219-400d-cf3a7777a73b-13171427"
                  className="ix-link-wrapper w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8204-4c46e22b"
                >
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="content-block-link gap-xsmall w-inline-block"
                  >
                    <div className="image-ratio_3x4">
                      <img
                        width="1216"
                        height="832"
                        alt="AI Support Lead"
                        src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff33e_f5407dcb-a4f9-4084-9a58-678053876edd.avif"
                        loading="lazy"
                        className="image_cover position_relative"
                      />
                    </div>
                    <div className="content-block">
                      <div className="heading_xsmall">Keiz V3</div>
                      <div className="author_info">Omni-Engine Intelligence</div>
                    </div>
                  </a>
                </div>
                <div
                  id="w-node-_3c13e20d-d7fe-7185-aee9-22127edf528c-13171427"
                  className="ix-link-wrapper w-node-cb4dba44-4d1a-628d-42f9-3215b3dc820d-4c46e22b"
                >
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="content-block-link gap-xsmall w-inline-block"
                  >
                    <div className="image-ratio_3x4">
                      <img
                        width="1216"
                        height="832"
                        alt="image of studio atmosphere (game development company)"
                        src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff317_d4306692-e529-4e4a-b062-4daabe982af1.avif"
                        loading="lazy"
                        className="image_cover position_relative"
                      />
                    </div>
                    <div className="content-block">
                      <div className="heading_xsmall">Drew Ellis</div>
                      <div className="author_info">Lead Product Designer</div>
                    </div>
                  </a>
                </div>
                <div
                  id="w-node-_71574e7a-f528-0557-7613-033dae4eed95-13171427"
                  className="ix-link-wrapper w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8216-4c46e22b"
                >
                  <a
                    href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                    className="content-block-link gap-xsmall w-inline-block"
                  >
                    <div className="image-ratio_3x4">
                      <img
                        width="1216"
                        height="832"
                        alt="image of a customer service representative working in a digital interface environment [digital project]"
                        src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff349_433498c6-fe6e-4cc5-8b7f-6e4f1214d21d.avif"
                        loading="lazy"
                        className="image_cover position_relative"
                      />
                    </div>
                    <div className="content-block">
                      <div className="heading_xsmall">Skylar James</div>
                      <div className="author_info">
                        Technical Support Engineer
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="faq" style={{minHeight: "80vh"}} className="section">
        <div className="container">
          <div className="header">
            <h2 className="heading_primary">
              FAQ: Everything you need to know
            </h2>
            <div className="rich-text subheading w-richtext">
              <p>Essential info for small businesses</p>
            </div>
          </div>
          <ul role="list" className="list-divided gap-small w-list-unstyled">
            <li>
              <div className="w-layout-grid grid_2-col gap-small">
                <div
                  id="w-node-_3be33fdb-2fcd-d7fb-0d8e-5a319030e178-c1865c6f"
                  className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8223-4c46e22b"
                >
                  How do I get started?
                </div>
                <div className="rich-text paragraph_large w-richtext">
                  <p>
                    Sign up and share your details. We’ll handle setup and
                    launch your chatbot fast.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="w-layout-grid grid_2-col gap-small">
                <div
                  id="w-node-ca4bf7cd-fbe4-2be3-802a-68405686a723-c1865c6f"
                  className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc822c-4c46e22b"
                >
                  What payment methods can I use?
                </div>
                <div className="rich-text paragraph_large w-richtext">
                  <p>
                    We support credit cards, debit cards, and PayPal for all
                    subscriptions.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="w-layout-grid grid_2-col gap-small">
                <div
                  id="w-node-_9be834eb-dca0-8ed6-cbbd-8d2aaa68b1a5-c1865c6f"
                  className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc8233-4c46e22b"
                >
                  How can I contact support?
                </div>
                <div className="rich-text paragraph_large w-richtext">
                  <p>
                    Reach us by email or live chat. We respond within one
                    business day.
                  </p>
                </div>
              </div>
            </li>
            <li>
              <div className="w-layout-grid grid_2-col gap-small">
                <div
                  id="w-node-_683b0460-6ea2-f87a-1c9c-16e707e2e42f-c1865c6f"
                  className="heading_small w-node-cb4dba44-4d1a-628d-42f9-3215b3dc823a-4c46e22b"
                >
                  Can I cancel my plan anytime?
                </div>
                <div className="rich-text paragraph_large w-richtext">
                  <p>
                    Yes, cancel anytime in your account. Your service runs until
                    the end of your billing period.
                  </p>
                </div>
              </div>
            </li>
          </ul>
          <div className="padding-top_medium">
            <p>Still have questions?</p>
            <div className="ix-link-wrapper">
              <a href="#contact" className="text-button w-inline-block">
                <div>Contact us</div>
                <div className="button_icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="100%"
                    height="100%"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2 8H14.5M14.5 8L8.5 2M14.5 8L8.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    ></path>
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
      <section id="contact" style={{minHeight: "80vh"}} className="section is-secondary">
        <div className="container">
          <div className="header is-align-center">
            <div className="eyebrow">Contact</div>
            <h2 className="heading_primary">Connect with our team today</h2>
            <div className="subheading rich-text w-richtext">
              <p>
                Have questions or need a demo? Fill out the form and we’ll
                respond within one business day.
              </p>
            </div>
          </div>
          <ul role="list" className="grid_4-col gap-small w-list-unstyled">
            <li>
              <div className="content-block height_100percent">
                <div className="image-ratio_3x2">
                  <img
                    width="1216"
                    height="832"
                    alt="background image"
                    src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff31c_56a932a7-398e-4741-b13f-2c469e3274de.avif"
                    loading="lazy"
                    className="image_cover"
                  />
                </div>
                <div className="margin-bottom_small">
                  <div className="rich-text w-richtext">
                    <h3>Sales questions</h3>
                    <p>
                      Ask about pricing, features, or plans. We’ll help you find
                      the best fit.
                    </p>
                  </div>
                </div>
                <div className="margin_top-auto">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Inquire
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="content-block height_100percent">
                <div className="image-ratio_3x2">
                  <img
                    width="1216"
                    height="832"
                    alt="image of an office collaboration scene (for a mobility and transportation)"
                    src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff321_fe1d5157-5784-4168-8c19-8d2e0dc6872e.avif"
                    loading="lazy"
                    className="image_cover"
                  />
                </div>
                <div className="margin-bottom_small">
                  <div className="rich-text w-richtext">
                    <h3>Support</h3>
                    <p>
                      Need setup help or troubleshooting? Our team is ready to
                      assist.
                    </p>
                  </div>
                </div>
                <div className="margin_top-auto">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Support
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="content-block height_100percent">
                <div className="image-ratio_3x2">
                  <img
                    width="1216"
                    height="832"
                    alt="image of package tracking interface (for a courier &amp; delivery service)"
                    src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff336_5510ed9b-9362-4184-816f-8d3157355192.avif"
                    loading="lazy"
                    className="image_cover"
                  />
                </div>
                <div className="margin-bottom_small">
                  <div className="rich-text w-richtext">
                    <h3>Partnerships</h3>
                    <p>
                      Interested in collaborating? Let’s discuss partnership
                      options.
                    </p>
                  </div>
                </div>
                <div className="margin_top-auto">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Connect
                  </a>
                </div>
              </div>
            </li>
            <li>
              <div className="content-block height_100percent">
                <div className="image-ratio_3x2">
                  <img
                    width="1216"
                    height="832"
                    alt="image of a person brainstorming ideas for a productivity tools business"
                    src="https://cdn.prod.website-files.com/69f542c83da0ffb64c46e220/69f5cd0aed89556a1f6ff33a_92068858-8e22-4d0d-927f-99fc343ff662.avif"
                    loading="lazy"
                    className="image_cover"
                  />
                </div>
                <div className="margin-bottom_small">
                  <div className="rich-text w-richtext">
                    <h3>Other inquiries</h3>
                    <p>
                      Not sure where to start? Reach out and we’ll guide you.
                    </p>
                  </div>
                </div>
                <div className="margin_top-auto">
                  <a href="#" onClick={(e) => handleLinkClick(e, "Get started")} className="button w-button">
                    Contact
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <nav
            id="w-node-_6ad1bb8a-187a-5914-7e93-f0ff6ddef7aa-58d779c3"
            className="content-block is-x-left margin-bottom_large w-node-a17d5ce7-8b58-2840-476b-f984f1586f7f-31ca503c"
          >
            <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({top: 0, behavior: "smooth"}); }} className="logo-link w-inline-block">
              <div className="nav_logo-icon" style={{ width: '28px', height: '28px' }}>
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 33 33"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    d="M28,0H5C2.24,0,0,2.24,0,5v23c0,2.76,2.24,5,5,5h23c2.76,0,5-2.24,5-5V5c0-2.76-2.24-5-5-5ZM29,17c-6.63,0-12,5.37-12,12h-1c0-6.63-5.37-12-12-12v-1c6.63,0,12-5.37,12-12h1c0,6.63,5.37,12,12,12v1Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <div
                data-brand-name="true"
                className="paragraph_xlarge margin-bottom_none"
                style={{ fontWeight: 900, letterSpacing: '-0.02em', color: 'white' }}
              >
                ChatBoost <span style={{ color: '#BB00FF', opacity: 0.8 }}>by Shinju AI</span>
              </div>
            </a>
          </nav>
          <nav className="grid_6-col gap-small">
            <ul role="list" className="grid-item-manual w-list-unstyled">
              <li className="list_item">
                <div className="heading_xxsmall text-color_secondary">
                  Product
                </div>
              </li>
              <li className="list_item">
                <a href="#features" className="footer_link w-inline-block">
                  <div>Features</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#pricing" className="footer_link w-inline-block">
                  <div>Pricing</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#" onClick={(e) => handleLinkClick(e, "Demo")} className="footer_link w-inline-block">
                  <div>Demo</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#contact" className="footer_link w-inline-block">
                  <div>Support</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#contact" className="footer_link w-inline-block">
                  <div>Contact</div>
                </a>
              </li>
            </ul>
            <ul role="list" className="grid-item-manual w-list-unstyled">
              <li className="list_item">
                <h2 className="heading_xxsmall text-color_secondary">
                  Company
                </h2>
              </li>
              <li className="list_item">
                <a href="#results" className="footer_link w-inline-block">
                  <div>About</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#results" className="footer_link w-inline-block">
                  <div>Careers</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#results" className="footer_link w-inline-block">
                  <div>Blog</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#results" className="footer_link w-inline-block">
                  <div>Press</div>
                </a>
              </li>
              <li className="list_item">
                <a href="#results" className="footer_link w-inline-block">
                  <div>Partners</div>
                </a>
              </li>
            </ul>
            <ul role="list" className="grid-item-manual w-list-unstyled">
              <li>
                <p className="heading_xxsmall text-color_secondary">
                  Resources
                </p>
              </li>
              <li>
                <a href="#results" className="footer_link w-inline-block">
                  <div>Docs</div>
                </a>
              </li>
              <li>
                <a href="#results" className="footer_link w-inline-block">
                  <div>API</div>
                </a>
              </li>
              <li>
                <a href="#results" className="footer_link w-inline-block">
                  <div>Guides</div>
                </a>
              </li>
              <li>
                <a href="#results" className="footer_link w-inline-block">
                  <div>FAQ</div>
                </a>
              </li>
              <li>
                <a href="#results" className="footer_link w-inline-block">
                  <div>Status</div>
                </a>
              </li>
            </ul>
            <div
              id="w-node-_1d4bd314-7738-0aa1-ed40-16ec637976a1-58d779c3"
              className="grid-item-manual w-node-a17d5ce7-8b58-2840-476b-f984f1586fde-31ca503c"
            >
              <div className="form_block w-form">
                <p className="heading_xxsmall text-color_secondary">
                  Subscribe for updates
                </p>
                <form
                  onSubmit={handleFormSubmit}
                  data-wf-element-id="a17d5ce7-8b58-2840-476b-f984f1586fd6"
                  name="wf-form-Subscribe"
                  data-name="Subscribe"
                  id="wf-form-Subscribe"
                  data-wf-page-id="69f542c93da0ffb64c46e22b"
                  className="form"
                  data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"
                >
                  <div className="form_item margin-bottom_none">
                    <label
                      htmlFor="subscribe-email-2"
                      className="input_label screen-reader"
                    >
                      Email
                    </label>
                    <input
                      className="input_field w-input"
                      maxLength={256}
                      name="email-2"
                      data-name="Email 2"
                      placeholder="Email"
                      type="email"
                      id="subscribe-email"
                      required={true}
                    />
                  </div>
                  <div className="form_item">
                    <div className="flex_horizontal gap-xsmall is-space-between">
                      <input
                        type="submit"
                        data-wait="Please wait..."
                        role="button"
                        className="button w-button"
                        value="Subscribe"
                      />
                      <p className="paragraph_small margin-top_xsmall">
                        View our{" "}
                        <a
                          href="#" onClick={(e) => handleLinkClick(e, "Link")} 
                          className="text-link is-secondary text-span_padding"
                        >
                          privacy policy
                        </a>{" "}
                        for details.
                      </p>
                    </div>
                  </div>
                </form>
                <div className="footer_form_success-message w-form-done">
                  <div>Thanks for subscribing!</div>
                </div>
                <div className="w-form-fail">
                  <div>Submission failed. Please try again.</div>
                </div>
              </div>
            </div>
          </nav>
          <div className="divider margin-top_xsmall margin-bottom_xsmall"></div>
          <nav className="footer_bottom">
            <div className="flex_horizontal is-y-baseline gap-small ix-link-wrapper">
              <div className="text-color_secondary">
                © 2026 ChatBoost by Shinju AI. All rights reserved.
              </div>
              <a href="#results" className="footer_link">
                Privacy
              </a>
            </div>
            <ul
              role="list"
              aria-label="Social media links"
              className="footer_icon-group w-list-unstyled"
            >
              <li className="margin-bottom_none">
                <a onClick={(e) => handleLinkClick(e, "Social Media")} className="footer_icon-link w-inline-block">
                  <svg width="100%" height="100%" viewBox="0 0 16 16">
                    <path
                      d="M16,8.048a8,8,0,1,0-9.25,7.9V10.36H4.719V8.048H6.75V6.285A2.822,2.822,0,0,1,9.771,3.173a12.2,12.2,0,0,1,1.791.156V5.3H10.554a1.155,1.155,0,0,0-1.3,1.25v1.5h2.219l-.355,2.312H9.25v5.591A8,8,0,0,0,16,8.048Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <div className="screen-reader">Facebook</div>
                </a>
              </li>
              <li className="margin-bottom_none">
                <a onClick={(e) => handleLinkClick(e, "Social Media")} className="footer_icon-link w-inline-block">
                  <svg width="100%" height="100%" viewBox="0 0 16 16">
                    <path
                      d="M8,1.441c2.136,0,2.389.009,3.233.047a4.419,4.419,0,0,1,1.485.276,2.472,2.472,0,0,1,.92.6,2.472,2.472,0,0,1,.6.92,4.419,4.419,0,0,1,.276,1.485c.038.844.047,1.1.047,3.233s-.009,2.389-.047,3.233a4.419,4.419,0,0,1-.276,1.485,2.644,2.644,0,0,1-1.518,1.518,4.419,4.419,0,0,1-1.485.276c-.844.038-1.1.047-3.233.047s-2.389-.009-3.233-.047a4.419,4.419,0,0,1-1.485-.276,2.472,2.472,0,0,1-.92-.6,2.472,2.472,0,0,1-.6-.92,4.419,4.419,0,0,1-.276-1.485c-.038-.844-.047-1.1-.047-3.233s.009-2.389.047-3.233a4.419,4.419,0,0,1,.276-1.485,2.472,2.472,0,0,1,.6-.92,2.472,2.472,0,0,1,.92-.6,4.419,4.419,0,0,1,1.485-.276c.844-.038,1.1-.047,3.233-.047M8,0C5.827,0,5.555.009,4.7.048A5.868,5.868,0,0,0,2.76.42a3.908,3.908,0,0,0-1.417.923A3.908,3.908,0,0,0,.42,2.76,5.868,5.868,0,0,0,.048,4.7C.009,5.555,0,5.827,0,8s.009,2.445.048,3.3A5.868,5.868,0,0,0,.42,13.24a3.908,3.908,0,0,0,.923,1.417,3.908,3.908,0,0,0,1.417.923,5.868,5.868,0,0,0,1.942.372C5.555,15.991,5.827,16,8,16s2.445-.009,3.3-.048a5.868,5.868,0,0,0,1.942-.372,4.094,4.094,0,0,0,2.34-2.34,5.868,5.868,0,0,0,.372-1.942c.039-.853.048-1.125.048-3.3s-.009-2.445-.048-3.3A5.868,5.868,0,0,0,15.58,2.76a3.908,3.908,0,0,0-.923-1.417A3.908,3.908,0,0,0,13.24.42,5.868,5.868,0,0,0,11.3.048C10.445.009,10.173,0,8,0Z"
                      fill="currentColor"
                    ></path>
                    <path
                      d="M8,3.892A4.108,4.108,0,1,0,12.108,8,4.108,4.108,0,0,0,8,3.892Zm0,6.775A2.667,2.667,0,1,1,10.667,8,2.667,2.667,0,0,1,8,10.667Z"
                      fill="currentColor"
                    ></path>
                    <circle
                      cx="12.27"
                      cy="3.73"
                      r="0.96"
                      fill="currentColor"
                    ></circle>
                  </svg>
                  <div className="screen-reader">
                    Instagram
                    <br />
                  </div>
                </a>
              </li>
              <li className="margin-bottom_none">
                <a onClick={(e) => handleLinkClick(e, "Social Media")} className="footer_icon-link w-inline-block">
                  <svg width="100%" height="100%" viewBox="0 0 16 16">
                    <path
                      d="M12.3723 1.16992H14.6895L9.6272 6.95576L15.5825 14.829H10.9196L7.26734 10.0539L3.08837 14.829H0.769833L6.18442 8.64037L0.471436 1.16992H5.2528L8.55409 5.53451L12.3723 1.16992ZM11.5591 13.4421H12.843L4.55514 2.48399H3.17733L11.5591 13.4421Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <div className="screen-reader">X</div>
                </a>
              </li>
              <li className="margin-bottom_none">
                <a onClick={(e) => handleLinkClick(e, "Social Media")} className="footer_icon-link w-inline-block">
                  <svg width="100%" height="100%" viewBox="0 0 16 16">
                    <path
                      d="M15.3,0H0.7C0.3,0,0,0.3,0,0.7v14.7C0,15.7,0.3,16,0.7,16h14.7c0.4,0,0.7-0.3,0.7-0.7V0.7 C16,0.3,15.7,0,15.3,0z M4.7,13.6H2.4V6h2.4V13.6z M3.6,5C2.8,5,2.2,4.3,2.2,3.6c0-0.8,0.6-1.4,1.4-1.4c0.8,0,1.4,0.6,1.4,1.4 C4.9,4.3,4.3,5,3.6,5z M13.6,13.6h-2.4V9.9c0-0.9,0-2-1.2-2c-1.2,0-1.4,1-1.4,2v3.8H6.2V6h2.3v1h0c0.3-0.6,1.1-1.2,2.2-1.2 c2.4,0,2.8,1.6,2.8,3.6V13.6z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <div className="screen-reader">LinkedIn</div>
                </a>
              </li>
              <li className="margin-bottom_none">
                <a onClick={(e) => handleLinkClick(e, "Social Media")} className="footer_icon-link w-inline-block">
                  <svg width="100%" height="100%" viewBox="0 0 16 16">
                    <path
                      d="M15.8,4.8c-0.2-1.3-0.8-2.2-2.2-2.4C11.4,2,8,2,8,2S4.6,2,2.4,2.4C1,2.6,0.3,3.5,0.2,4.8C0,6.1,0,8,0,8 s0,1.9,0.2,3.2c0.2,1.3,0.8,2.2,2.2,2.4C4.6,14,8,14,8,14s3.4,0,5.6-0.4c1.4-0.3,2-1.1,2.2-2.4C16,9.9,16,8,16,8S16,6.1,15.8,4.8z M6,11V5l5,3L6,11z"
                      fill="currentColor"
                    ></path>
                  </svg>
                  <div className="screen-reader">YouTube</div>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </footer>

      {isModalOpen && modalContent === 'ONBOARDING' && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 11000
        }} onClick={() => onboardingStep === 0 && setIsModalOpen(false)}>
          <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', maxWidth: '500px', width: '90%', color: '#1a1a1a', textAlign: 'left' }} onClick={(e) => e.stopPropagation()}>
            {onboardingStep === 0 ? (
                <>
                    <h2 className="heading_primary_modal" style={{ color: '#1a1a1a', marginBottom: '16px' }}>Get Started</h2>
                    <p className="paragraph_small" style={{ color: '#666', marginBottom: '24px' }}>Tell us about your business to begin your 14-day free trial.</p>
                    <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input className="modal_input" placeholder="Full Name" required name="user_name" />
                    <input className="modal_input" placeholder="Business Name" required name="business_name" />
                    <input className="modal_input" type="email" placeholder="Work Email" required name="user_email" />
                    <select className="modal_input" name="niche" style={{ cursor: 'pointer' }}>
                        <option>Restaurant</option>
                        <option>Salon / Spa</option>
                        <option>Retail</option>
                        <option>Other</option>
                    </select>
                    <button className="button on-accent-primary" type="submit" style={{ border: 'none', padding: '16px', borderRadius: '12px', cursor: 'pointer', marginTop: '10px' }}>Create My Bot</button>
                    <button className="button is-secondary" type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '13px' }}>Cancel</button>
                    </form>
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <div style={{ width: '60px', height: '60px', border: '4px solid #f3f3f3', borderTop: '4px solid #BB00FF', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' }}></div>
                    <h3 className="heading_small" style={{ color: '#1a1a1a', marginBottom: '10px' }}>
                        {onboardingStep === 1 && "Analyzing business niche..."}
                        {onboardingStep === 2 && "Provisioning AI model..."}
                        {onboardingStep === 3 && "Finalizing dashboard..."}
                    </h3>
                    <div style={{ width: '100%', height: '8px', backgroundColor: '#eee', borderRadius: '4px', overflow: 'hidden', marginTop: '15px' }}>
                        <div style={{ width: `${(onboardingStep / 3) * 100}%`, height: '100%', backgroundColor: '#BB00FF', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>
            )}
          </div>
        </div>
      )}

      {isModalOpen && modalContent !== 'ONBOARDING' && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setIsModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              padding: "40px",
              borderRadius: "16px",
              maxWidth: "400px",
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
              color: "#1a1a1a",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="heading_primary_modal" style={{ color: "#1a1a1a", marginBottom: "16px" }}>Success!</h3>
            <p className="paragraph_small" style={{ color: "#666", marginBottom: "32px", lineHeight: '1.5' }}>{modalContent}</p>
            <button className="button on-accent-primary" onClick={() => setIsModalOpen(false)} style={{ border: 'none', padding: '16px 32px', borderRadius: '12px', cursor: 'pointer', width: '100%', fontSize: '15px' }}>Awesome</button>
          </div>
        </div>
      )}

      {isDemoOpen && (
        <div style={{
          position: 'fixed', bottom: '20px', right: '20px', width: '380px', height: '550px', 
          backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column', zIndex: 10000, overflow: 'hidden',
          border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <div style={{ backgroundColor: '#BB00FF', color: 'white', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '10px', height: '10px', background: '#00ff88', borderRadius: '50%', boxShadow: '0 0 10px #00ff88' }}></div>
                <strong style={{ fontSize: '13px', letterSpacing: '0.1em' }}>SHINJU AI LIVE DEMO</strong>
            </div>
            <span style={{ cursor: 'pointer', fontSize: '18px', opacity: 0.8 }} onClick={() => setIsDemoOpen(false)}>✕</span>
          </div>
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px', background: '#fcfcfc' }}>
            {demoMessages.map((m, i) => (
              <div key={i} style={{ 
                alignSelf: m.role === 'bot' ? 'flex-start' : 'flex-end',
                backgroundColor: m.role === 'bot' ? 'white' : '#BB00FF',
                color: m.role === 'bot' ? '#1a1a1a' : 'white',
                padding: '12px 18px', borderRadius: m.role === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px', 
                maxWidth: '85%', boxShadow: m.role === 'bot' ? '0 2px 8px rgba(0,0,0,0.04)' : '0 4px 12px rgba(187, 0, 255, 0.2)',
                fontSize: '14px', lineHeight: '1.5'
              }}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'white', padding: '12px 18px', borderRadius: '18px 18px 18px 4px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '6px', height: '6px', background: '#ddd', borderRadius: '50%', animation: 'bounce 1s infinite 0s' }}></div>
                <div style={{ width: '6px', height: '6px', background: '#ddd', borderRadius: '50%', animation: 'bounce 1s infinite 0.2s' }}></div>
                <div style={{ width: '6px', height: '6px', background: '#ddd', borderRadius: '50%', animation: 'bounce 1s infinite 0.4s' }}></div>
              </div>
            )}
            {!isTyping && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
                    {quickQuestions.map((q, idx) => (
                        <button 
                            key={idx} 
                            onClick={() => handleQuickQuestion(q)}
                            style={{ 
                                background: 'white', 
                                border: '1px solid #BB00FF', 
                                color: '#BB00FF', 
                                padding: '6px 12px', 
                                borderRadius: '12px', 
                                fontSize: '12px', 
                                fontWeight: 600, 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#BB00FF'; e.currentTarget.style.color = 'white'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = 'white'; e.currentTarget.style.color = '#BB00FF'; }}
                        >
                            {q}
                        </button>
                    ))}
                </div>
            )}
            <style>{`
                @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
            `}</style>
          </div>
          <form onSubmit={sendDemoMessage} style={{ padding: '15px', borderTop: '1px solid #eee', display: 'flex', background: 'white' }}>
            <input 
              className="modal_input" 
              placeholder="Ask anything..." 
              value={userInput} 
              onChange={(e) => setUserInput(e.target.value)}
              style={{ flex: 1, marginBottom: 0, padding: '12px 15px' }}
            />
          </form>
        </div>
      )}
    </>
  );
}

export default App;
