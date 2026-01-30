const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });

const NGO = require('./models/ngoModel');
const Campaign = require('./models/campaignModel');
const Blog = require('./models/blogModel');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/donate_period');

const ngos = [
  {
    name: "Period Care Foundation",
    description: "Dedicated to ensuring menstrual hygiene for all women in rural areas.",
    email: "contact@periodcare.org",
    phone: "+91 9876543210",
    image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400",
    location: { coordinates: [82.9739, 25.3176], address: "123 Main Street", city: "Varanasi", state: "Uttar Pradesh" },
    inventory: [
      { item: "Sanitary Pads", quantity: 500, minRequired: 100 },
      { item: "Menstrual Cups", quantity: 50, minRequired: 20 },
      { item: "Tampons", quantity: 200, minRequired: 50 }
    ],
    verified: true,
    rating: 4.8,
    totalDonations: 15000,
    beneficiariesServed: 2500,
    categories: ["menstrual health", "women empowerment"]
  },
  {
    name: "Women Wellness Initiative",
    description: "Empowering women through health education and product distribution.",
    email: "info@womenwellness.org",
    phone: "+91 9876543211",
    image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400",
    location: { coordinates: [82.9839, 25.3276], address: "456 Park Avenue", city: "Varanasi", state: "Uttar Pradesh" },
    inventory: [
      { item: "Sanitary Pads", quantity: 300, minRequired: 100 },
      { item: "Hygiene Kits", quantity: 100, minRequired: 30 },
      { item: "Educational Materials", quantity: 500, minRequired: 100 }
    ],
    verified: true,
    rating: 4.5,
    totalDonations: 12000,
    beneficiariesServed: 1800,
    categories: ["education", "health"]
  },
  {
    name: "Red Dot Movement",
    description: "Breaking the stigma around menstruation one conversation at a time.",
    email: "hello@reddot.org",
    phone: "+91 9876543212",
    image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400",
    location: { coordinates: [82.9639, 25.3076], address: "789 Community Center", city: "Varanasi", state: "Uttar Pradesh" },
    inventory: [
      { item: "Sanitary Pads", quantity: 800, minRequired: 200 },
      { item: "Menstrual Cups", quantity: 150, minRequired: 50 },
      { item: "Period Underwear", quantity: 75, minRequired: 25 }
    ],
    verified: true,
    rating: 4.9,
    totalDonations: 25000,
    beneficiariesServed: 4000,
    categories: ["awareness", "menstrual health"]
  },
  {
    name: "Sakhi Foundation",
    description: "Supporting underprivileged women with menstrual health products and education.",
    email: "support@sakhi.org",
    phone: "+91 9876543213",
    image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400",
    location: { coordinates: [82.9539, 25.3376], address: "321 Hope Lane", city: "Varanasi", state: "Uttar Pradesh" },
    inventory: [
      { item: "Sanitary Pads", quantity: 1200, minRequired: 300 },
      { item: "Hygiene Kits", quantity: 200, minRequired: 50 },
      { item: "Menstrual Cups", quantity: 100, minRequired: 30 }
    ],
    verified: true,
    rating: 4.7,
    totalDonations: 18000,
    beneficiariesServed: 3200,
    categories: ["women empowerment", "health"]
  }
];

const seedDB = async () => {
  try {
    await NGO.deleteMany({});
    await Campaign.deleteMany({});
    await Blog.deleteMany({});
    
    const createdNGOs = await NGO.insertMany(ngos);
    console.log('✅ NGOs seeded');

    const campaigns = [
      {
        title: "Pad the Difference",
        description: "Help us distribute 10,000 sanitary pads to rural schools this month. Every pad donated keeps a girl in school.",
        ngo: createdNGOs[0]._id,
        targetAmount: 50000,
        raisedAmount: 32000,
        targetItems: [{ item: "Sanitary Pads", targetQuantity: 10000, currentQuantity: 6400 }],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        urgency: "high",
        image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800"
      },
      {
        title: "Cup of Change",
        description: "Sustainable menstruation with reusable menstrual cups. One cup lasts 10 years and saves thousands of pads from landfills.",
        ngo: createdNGOs[1]._id,
        targetAmount: 75000,
        raisedAmount: 45000,
        targetItems: [{ item: "Menstrual Cups", targetQuantity: 500, currentQuantity: 300 }],
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        urgency: "medium",
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
      },
      {
        title: "Emergency Period Relief",
        description: "Urgent supplies needed for flood-affected areas. Women in disaster zones need immediate access to menstrual products.",
        ngo: createdNGOs[2]._id,
        targetAmount: 100000,
        raisedAmount: 78000,
        targetItems: [
          { item: "Sanitary Pads", targetQuantity: 5000, currentQuantity: 3900 },
          { item: "Hygiene Kits", targetQuantity: 200, currentQuantity: 156 }
        ],
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        urgency: "critical",
        image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800"
      },
      {
        title: "School Hygiene Program",
        description: "Installing pad vending machines and providing free supplies in 50 rural schools.",
        ngo: createdNGOs[3]._id,
        targetAmount: 150000,
        raisedAmount: 67000,
        targetItems: [
          { item: "Sanitary Pads", targetQuantity: 15000, currentQuantity: 6700 },
          { item: "Educational Materials", targetQuantity: 1000, currentQuantity: 450 }
        ],
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        urgency: "medium",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
      }
    ];
    
    await Campaign.insertMany(campaigns);
    console.log('✅ Campaigns seeded');

    const blogs = [
      {
        title: "Breaking the Silence: Why Period Talk Matters",
        content: "Menstruation is a natural biological process, yet millions of women around the world face stigma and shame. In many communities, periods are considered taboo, leading to misinformation, health issues, and missed educational opportunities. By normalizing conversations about menstruation, we can empower women to take control of their health and break free from harmful cultural practices. Education is the first step toward change. When we talk openly about periods, we reduce shame and increase access to proper menstrual products and healthcare.",
        excerpt: "Understanding the importance of open conversations about menstrual health and breaking cultural stigmas.",
        category: "education",
        featured: true,
        tags: ["menstruation", "stigma", "awareness", "education"],
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800"
      },
      {
        title: "How Your Donation Changes Lives",
        content: "Every pack of sanitary pads you donate helps a girl stay in school. Meet Priya, a 14-year-old from rural Uttar Pradesh who used to miss 5 days of school every month. With access to free sanitary products through our program, she now attends school regularly and dreams of becoming a doctor. Your contributions don't just provide products—they provide dignity, education, and hope for a better future.",
        excerpt: "Real impact stories from women who received support through our donation programs.",
        category: "stories",
        featured: true,
        tags: ["impact", "stories", "donation", "education"],
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"
      },
      {
        title: "Sustainable Menstruation: A Guide to Eco-Friendly Options",
        content: "The average woman uses over 11,000 disposable menstrual products in her lifetime. This creates significant environmental waste. Fortunately, sustainable alternatives are becoming more accessible. Menstrual cups, reusable pads, and period underwear offer eco-friendly options that are better for both your body and the planet. Learn about the benefits and how to make the switch.",
        excerpt: "Explore eco-friendly menstrual products that are better for you and the environment.",
        category: "education",
        tags: ["sustainability", "environment", "menstrual cups", "reusable"],
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800"
      },
      {
        title: "Upcoming Health Camp: Free Women's Health Checkups",
        content: "Join us this weekend for our free women's health camp featuring gynecological consultations, menstrual health awareness sessions, and free distribution of sanitary products. Our team of doctors and health workers will be available to answer questions and provide guidance on women's health issues. Location: Community Center, Varanasi. Date: Next Saturday, 9 AM - 5 PM.",
        excerpt: "Free health checkups and menstrual health awareness sessions coming to your community.",
        category: "events",
        tags: ["events", "health camp", "community", "free checkup"],
        image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800"
      },
      {
        title: "Volunteer Spotlight: Meet Our Heroes",
        content: "Our volunteers are the backbone of our organization. This month, we celebrate Anjali, who has dedicated over 500 hours to our cause. From distributing products in remote villages to conducting awareness sessions in schools, Anjali's commitment has touched thousands of lives. Want to make a difference like Anjali? Join our volunteer program today!",
        excerpt: "Celebrating the dedicated volunteers who make our mission possible.",
        category: "stories",
        tags: ["volunteers", "community", "heroes", "impact"],
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800"
      }
    ];
    
    await Blog.insertMany(blogs);
    console.log('✅ Blogs seeded');

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
