interface ContentTemplate {
  title: string;
  description: string;
  productName: string;
  targetAudience: string;
  keyFeatures: string;
  callToAction: string;
}

export const sampleTemplates: ContentTemplate[] = [
  {
    title: 'AI-Powered Analytics Dashboard',
    description: 'Transform your business data into actionable insights with our cutting-edge analytics platform.',
    productName: 'DataSense Pro',
    targetAudience: 'Data analysts, business intelligence teams, and decision-makers looking to leverage advanced analytics for better business outcomes.',
    keyFeatures: '• Real-time data visualization\n• Predictive analytics\n• Custom reporting\n• Automated insights\n• Integration with major data sources',
    callToAction: 'Start Free Trial',
  },
  {
    title: 'Cloud Storage Solution for Teams',
    description: 'Secure, scalable, and collaborative cloud storage designed for modern teams.',
    productName: 'CloudVault',
    targetAudience: 'Small to medium-sized businesses and enterprise teams seeking efficient and secure file management solutions.',
    keyFeatures: '• End-to-end encryption\n• Team collaboration tools\n• Version control\n• Mobile access\n• Advanced sharing options',
    callToAction: 'Get Started Free',
  },
  {
    title: 'Smart Project Management Platform',
    description: 'Streamline your workflow and boost team productivity with AI-assisted project management.',
    productName: 'TaskFlow AI',
    targetAudience: 'Project managers, team leaders, and organizations looking to optimize their project delivery and team collaboration.',
    keyFeatures: '• AI task prioritization\n• Resource allocation\n• Time tracking\n• Progress analytics\n• Team communication hub',
    callToAction: 'Try It Free',
  },
  {
    title: 'E-commerce Marketing Suite',
    description: 'Boost your online sales with our comprehensive e-commerce marketing toolkit.',
    productName: 'ShopBoost Pro',
    targetAudience: 'E-commerce business owners and marketers seeking to increase their online presence and sales performance.',
    keyFeatures: '• Social media integration\n• Email marketing automation\n• Analytics dashboard\n• Customer segmentation\n• A/B testing tools',
    callToAction: 'Boost Sales Now',
  },
  {
    title: 'HR Management System',
    description: 'Simplify your HR processes with our all-in-one human resource management solution.',
    productName: 'StaffHub',
    targetAudience: 'HR professionals and business owners looking to streamline their human resource operations and improve employee experience.',
    keyFeatures: '• Employee onboarding\n• Performance tracking\n• Leave management\n• Payroll integration\n• Training portal',
    callToAction: 'Schedule Demo',
  },
];

export function getRandomTemplate(): ContentTemplate {
  const randomIndex = Math.floor(Math.random() * sampleTemplates.length);
  return sampleTemplates[randomIndex];
}
