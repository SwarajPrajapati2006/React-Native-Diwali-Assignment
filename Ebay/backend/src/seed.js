const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Listing = require('./models/Listing');
const Enquiry = require('./models/Enquiry');
const Notification = require('./models/Notification');
const Favorite = require('./models/Favorite');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('[Seed] MONGODB_URI is not defined. Aborting.');
  process.exit(1);
}

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Listing.deleteMany({});
    await Enquiry.deleteMany({});
    await Notification.deleteMany({});
    await Favorite.deleteMany({});
    console.log('[Seed] Cleared collections');

    // Create 3 demo users
    const user1 = await User.create({
      name: 'Swaraj Kundan',
      email: 'swaraj@campus.edu',
      password: 'password123',
      college: 'XYZ College',
      role: 'XYZ College Student',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98765 43210',
      bio: 'Final year CS undergrad. Selling semester textbooks and tech gear.',
      contactPreferences: {
        whatsapp: true,
        email: true,
        phone: true,
        showPublic: true,
      },
      rating: 4.95,
      reviewCount: 18,
    });

    const user2 = await User.create({
      name: 'Aanya Sharma',
      email: 'aanya@campus.edu',
      password: 'password123',
      college: 'Indian Institute of Technology (IIT)',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98123 45678',
      bio: 'Design student. Decluttering room before graduation!',
      contactPreferences: {
        whatsapp: true,
        email: true,
        phone: false,
        showPublic: true,
      },
      rating: 4.88,
      reviewCount: 24,
    });

    const user3 = await User.create({
      name: 'Rohan Verma',
      email: 'rohan@campus.edu',
      password: 'password123',
      college: 'BITS Pilani',
      avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
      phone: '+91 98450 11223',
      bio: 'Hostel 4 resident. Happy to exchange books or donate.',
      contactPreferences: {
        whatsapp: true,
        email: true,
        phone: true,
        showPublic: true,
      },
      rating: 5.0,
      reviewCount: 9,
    });

    console.log('[Seed] Created demo users');

    // Create realistic campus listings across all categories
    const listings = await Listing.create([
      // --- BOOKS ---
      {
        title: 'Introduction to Algorithms (CLRS 4th Edition)',
        description: 'Hardcover copy in pristine condition. Zero pencil marks or highlighted pages. Must-have for algorithms and interview preparation!',
        price: 850,
        category: 'Books',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
          'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Campus Library Fund & Underprivileged Student Scholarships',
        pickupLocation: 'Central Library Ground Floor',
        coordinates: { latitude: 28.6139, longitude: 77.2090 },
        seller: user1._id,
      },
      {
        title: 'Operating System Concepts (10th Dinosaur Edition)',
        description: 'Silberschatz OS textbook. Clean pages with important exam sticky flags. Essential for semester core subjects.',
        price: 600,
        category: 'Books',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1532012164546-f432f2e37274?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Computer Science Department Reception',
        coordinates: { latitude: 28.6142, longitude: 77.2088 },
        seller: user1._id,
      },
      {
        title: 'Concepts of Physics (Vol 1 & 2) by H.C. Verma',
        description: 'Classic physics reference set. Great for first year mechanics and electrical physics foundation courses.',
        price: 450,
        category: 'Books',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Rural Education STEM Outreach',
        pickupLocation: 'Hostel Block A Lawn',
        coordinates: { latitude: 28.6150, longitude: 77.2075 },
        seller: user2._id,
      },
      {
        title: 'GATE Computer Science & IT Complete Prep Set',
        description: 'Made Easy handbooks and 12 subject summary binders. Completely free for any junior preparing for GATE 2027.',
        price: 0,
        category: 'Books',
        type: 'Free',
        condition: 'Fair',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1491841573634-28140fc7ced7?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel 4 Common Study Hall',
        coordinates: { latitude: 28.6130, longitude: 77.2105 },
        seller: user3._id,
      },

      // --- ELECTRONICS ---
      {
        title: 'Logitech MX Master 3S Wireless Mouse',
        description: 'Ultra quiet electromagnetic scroll wheel, connects up to 3 devices via Bluetooth. Includes USB-C charging cable.',
        price: 3200,
        category: 'Electronics',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel Block B Common Room',
        coordinates: { latitude: 28.6145, longitude: 77.2085 },
        seller: user2._id,
      },
      {
        title: 'Keychron K2 Wireless Mechanical Keyboard (Gateron Brown)',
        description: 'Mac & Windows compatible mechanical keyboard with white LED backlighting and tactile switches. Works wired and wireless.',
        price: 4200,
        category: 'Electronics',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Campus Tech Hub / Innovation Center',
        coordinates: { latitude: 28.6140, longitude: 77.2110 },
        seller: user1._id,
      },
      {
        title: 'Sony WH-1000XM4 Noise Canceling Headphones',
        description: 'Open to exchange for an iPad with Apple Pencil or sell outright. Battery lasts over 30 hours. Comes with travel case.',
        price: 9500,
        category: 'Electronics',
        type: 'Exchange',
        exchangeFor: 'iPad 9th/10th Gen or Apple Pencil 2',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Auditorium Quad',
        coordinates: { latitude: 28.6135, longitude: 77.2095 },
        seller: user3._id,
      },
      {
        title: 'Arduino Uno Mega + 35 Sensor IoT Robotics Kit',
        description: 'Includes breadboard, jumper wires, ultrasonic sensors, motors, LCD display module, and project guide.',
        price: 1100,
        category: 'Electronics',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Campus Robotics Club Sponsorship',
        pickupLocation: 'Electronics Hardware Lab 2',
        coordinates: { latitude: 28.6155, longitude: 77.2080 },
        seller: user2._id,
      },
      {
        title: 'Dell 24-inch Full HD Borderless IPS Monitor (75Hz)',
        description: 'Crisp IPS panel with HDMI and VGA ports. Comes with power adapter and high-speed HDMI cable. Perfect second screen for coding.',
        price: 5400,
        category: 'Electronics',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel 3 Gate',
        coordinates: { latitude: 28.6125, longitude: 77.2090 },
        seller: user1._id,
      },
      {
        title: 'Mi 20,000mAh 18W Fast Charging Power Bank',
        description: 'Dual USB output ports, micro-USB and Type-C input. Solid battery health, easily charges phones 4-5 times during power cuts.',
        price: 850,
        category: 'Electronics',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1609592424109-dd9892f1b177?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Main Canteen',
        coordinates: { latitude: 28.6146, longitude: 77.2100 },
        seller: user3._id,
      },

      // --- FURNITURE ---
      {
        title: 'Ergonomic Mesh Study Chair with Lumbar Support',
        description: 'Adjustable height and breathable mesh back. Super comfortable for long night study sessions. Pick up from Hostel 7.',
        price: 1400,
        category: 'Furniture',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1580481077195-c3a8214583b2?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Campus Green Initiative & Recycling Drive',
        pickupLocation: 'Hostel 7, Room 302',
        coordinates: { latitude: 28.6128, longitude: 77.2078 },
        seller: user1._id,
      },
      {
        title: 'Foldable Wooden Laptop Bed Table with Cup Holder',
        description: 'Lightweight folding study desk with tablet slot and drink holder. Folds flat to slide under bed when not in use.',
        price: 350,
        category: 'Furniture',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel 4 Porch',
        coordinates: { latitude: 28.6133, longitude: 77.2082 },
        seller: user2._id,
      },
      {
        title: '3-Tier Rolling Metal Utility Cart for Hostel Storage',
        description: 'Heavy duty steel rolling cart with wheels. Ideal for toiletries, snacks, books, and keeping room organized.',
        price: 750,
        category: 'Furniture',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel Block C Entrance',
        coordinates: { latitude: 28.6140, longitude: 77.2070 },
        seller: user3._id,
      },

      // --- STATIONERY ---
      {
        title: 'Casio fx-991EX Classwiz Scientific Calculator',
        description: 'Used for two semesters only. Solar powered plus battery. Display is scratchless. Perfect for engineering mathematics and exams.',
        price: 650,
        category: 'Stationery',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Cafeteria / Student Union',
        coordinates: { latitude: 28.6152, longitude: 77.2101 },
        seller: user3._id,
      },
      {
        title: 'Engineering Mini Drafter + Drawing Board Set',
        description: 'Giving away completely free to any 1st year mechanical/civil student who needs it for Engineering Graphics lab.',
        price: 0,
        category: 'Stationery',
        type: 'Free',
        condition: 'Fair',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Mechanical Workshop Block',
        coordinates: { latitude: 28.6160, longitude: 77.2115 },
        seller: user2._id,
      },
      {
        title: 'Staedtler Technical Drafting Pen & Compass Geometry Set',
        description: 'Full precision compass, dividers, lead refills, and technical fineliners (0.1, 0.3, 0.5mm).',
        price: 380,
        category: 'Stationery',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Architecture Dept Student Aid',
        pickupLocation: 'Architecture Building Atrium',
        coordinates: { latitude: 28.6165, longitude: 77.2098 },
        seller: user1._id,
      },
      {
        title: 'Pack of 5 Spiral Ruled Notebooks (Unused)',
        description: '300 pages each, premium thick paper. Surplus from start-of-semester bulk purchase.',
        price: 250,
        category: 'Stationery',
        type: 'For Sale',
        condition: 'New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Library Courtyard',
        coordinates: { latitude: 28.6138, longitude: 77.2092 },
        seller: user2._id,
      },

      // --- OTHER ---
      {
        title: 'Hero Sprint Hybrid Campus Bicycle with Lock',
        description: 'Single-speed campus cycle with front basket and heavy-duty combination lock. Tires replaced last month. Smooth ride.',
        price: 2100,
        category: 'Other',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: true,
        donationCause: 'Clean Campus Animal Shelter Welfare',
        pickupLocation: 'Main Sports Complex Cycle Stand',
        coordinates: { latitude: 28.6148, longitude: 77.2065 },
        seller: user1._id,
      },
      {
        title: 'Prestige 1.5L Stainless Steel Electric Kettle',
        description: 'Auto shut-off, boil-dry protection, 1500W heating element. Lifesaver for late night tea, coffee, and hostel noodles.',
        price: 490,
        category: 'Other',
        type: 'For Sale',
        condition: 'Good',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1594213114663-d94db9213123?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Hostel 2 Mess',
        coordinates: { latitude: 28.6144, longitude: 77.2081 },
        seller: user3._id,
      },
      {
        title: 'Yonex Muscle Power 29 Lite Badminton Racket Set',
        description: 'Pair of lightweight aluminum-carbon rackets with full cover and tube of Mavis 350 nylon shuttlecocks. Ready to play.',
        price: 1350,
        category: 'Other',
        type: 'For Sale',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Indoor Badminton Courts',
        coordinates: { latitude: 28.6158, longitude: 77.2072 },
        seller: user2._id,
      },
      {
        title: 'Yamaha F310 Full Size Acoustic Guitar + Padded Gig Bag',
        description: 'Spruce top with rosewood fingerboard. Recently strung with D’Addario bronze strings. Will exchange for electric keyboard or sell.',
        price: 5800,
        category: 'Other',
        type: 'Exchange',
        exchangeFor: 'Casio / Yamaha 61-Key Keyboard',
        condition: 'Like New',
        status: 'Available',
        images: [
          'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=600&q=80',
        ],
        isDonation: false,
        pickupLocation: 'Music Society Room / OAT',
        coordinates: { latitude: 28.6136, longitude: 77.2108 },
        seller: user3._id,
      },
    ]);

    console.log(`[Seed] Successfully created ${listings.length} listings across all categories!`);

    // Create an initial enquiry
    await Enquiry.create({
      listing: listings[0]._id,
      buyer: user2._id,
      seller: user1._id,
      message: 'Hi Swaraj, would you take ₹750 if I pick it up today at the library?',
      offerPrice: 750,
      status: 'Pending',
    });

    // Create sample notification
    await Notification.create({
      user: user1._id,
      title: 'New Offer on CLRS Algorithm Book!',
      message: 'Aanya offered ₹750 for your listing. Tap to review.',
      type: 'offer',
      data: { listingId: listings[0]._id },
    });

    console.log('[Seed] Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error:', error);
    process.exit(1);
  }
};

seedDatabase();
