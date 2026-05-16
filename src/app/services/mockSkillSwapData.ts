// Mock data service for Skill Swap platform - generates realistic dynamic data

export type AvailabilityStatus = "Online" | "Offline";
export type SwapStatus = "Pending" | "Accepted" | "Completed";

export interface SkillSwapUser {
  id: string;
  userName: string;
  avatar: string;
  skillOffered: string;
  skillRequested: string;
  location: string;
  availabilityStatus: AvailabilityStatus;
  swapStatus: SwapStatus;
  lastActive: Date;
}

const FIRST_NAMES = [
  "Aarav", "Priya", "Rohan", "Ananya", "Vihaan", "Ishaan", "Diya", "Arjun",
  "Kavya", "Aditya", "Meera", "Sai", "Neha", "Raj", "Simran", "Kabir",
  "Tanvi", "Vikram", "Pooja", "Arnav", "Riya", "Dev", "Sanya", "Karan",
  "Nisha", "Omar", "Zara", "Ayaan", "Mira", "Dhruv", "Shreya", "Yash",
  "Aisha", "Reyansh", "Anvi", "Vivaan", "Saanvi", "Krishna", "Pari", "Atharv",
  "Ira", "Shaurya", "Myra", "Advait", "Kiara", "Ritvik", "Aanya", "Pranav",
];

const LAST_NAMES = [
  "Sharma", "Patel", "Gupta", "Singh", "Mehta", "Kumar", "Reddy", "Joshi",
  "Nair", "Rao", "Desai", "Shah", "Malhotra", "Verma", "Iyer", "Kapoor",
  "Chopra", "Banerjee", "Das", "Srinivasan", "Kulkarni", "Thakur", "Saxena",
  "Agarwal", "Bhat", "Pandey", "Mishra", "Chauhan", "Pillai", "Rajan",
];

const SKILLS = [
  "React", "Python", "Machine Learning", "UI/UX Design", "Data Science",
  "Node.js", "TypeScript", "Flutter", "Java", "C++", "Rust", "Go",
  "Figma", "Adobe XD", "Photoshop", "Video Editing", "3D Modeling",
  "DevOps", "Cloud Computing", "Cybersecurity", "Blockchain", "Web3",
  "SQL", "MongoDB", "GraphQL", "Docker", "Kubernetes", "AWS",
  "Digital Marketing", "Content Writing", "Public Speaking", "Photography",
  "Music Production", "Guitar", "Piano", "Singing", "Dance",
  "Yoga", "Cooking", "French", "Spanish", "Japanese", "Mandarin",
];

const LOCATIONS = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Kochi",
  "Indore", "Bhopal", "Nagpur", "Visakhapatnam", "Coimbatore", "Gurgaon",
  "Noida", "Mysore", "Vadodara", "Thiruvananthapuram", "Mangalore", "Dehradun",
];

const AVATARS = [
  "🧑‍💻", "👩‍🎨", "👨‍🔬", "👩‍💼", "🧑‍🎓", "👩‍🏫", "👨‍🎤", "👩‍🔧",
  "🧑‍🍳", "👨‍⚕️", "👩‍🚀", "🧑‍🎨", "👨‍💻", "👩‍🔬", "🧑‍💼", "👨‍🎓",
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomId(): string {
  return `swap-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function randomLastActive(): Date {
  const now = new Date();
  const minutesAgo = Math.floor(Math.random() * 120); // 0-120 minutes ago
  return new Date(now.getTime() - minutesAgo * 60 * 1000);
}

function generateUser(): SkillSwapUser {
  const firstName = randomFrom(FIRST_NAMES);
  const lastName = randomFrom(LAST_NAMES);
  let skillOffered = randomFrom(SKILLS);
  let skillRequested = randomFrom(SKILLS);
  // Ensure offered and requested skills are different
  while (skillRequested === skillOffered) {
    skillRequested = randomFrom(SKILLS);
  }

  const isOnline = Math.random() > 0.35;

  return {
    id: randomId(),
    userName: `${firstName} ${lastName}`,
    avatar: randomFrom(AVATARS),
    skillOffered,
    skillRequested,
    location: randomFrom(LOCATIONS),
    availabilityStatus: isOnline ? "Online" : "Offline",
    swapStatus: randomFrom(["Pending", "Accepted", "Completed"] as SwapStatus[]),
    lastActive: isOnline ? new Date() : randomLastActive(),
  };
}

// Generate initial dataset
export function generateInitialData(count: number = 50): SkillSwapUser[] {
  return Array.from({ length: count }, () => generateUser());
}

// Generate a single new user (simulates a new join)
export function generateNewUser(): SkillSwapUser {
  const user = generateUser();
  user.availabilityStatus = "Online";
  user.lastActive = new Date();
  user.swapStatus = "Pending";
  return user;
}

// Simulate a random update to an existing user
export function simulateUserUpdate(user: SkillSwapUser): SkillSwapUser {
  const updateType = Math.random();

  if (updateType < 0.3) {
    // Toggle availability
    return {
      ...user,
      availabilityStatus: user.availabilityStatus === "Online" ? "Offline" : "Online",
      lastActive: new Date(),
    };
  } else if (updateType < 0.6) {
    // Change swap status
    const statuses: SwapStatus[] = ["Pending", "Accepted", "Completed"];
    const currentIdx = statuses.indexOf(user.swapStatus);
    const nextStatus = statuses[Math.min(currentIdx + 1, statuses.length - 1)];
    return {
      ...user,
      swapStatus: nextStatus,
      lastActive: new Date(),
    };
  } else {
    // Update last active time
    return {
      ...user,
      lastActive: new Date(),
    };
  }
}

// Format time ago string
export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return "Just now";
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Get all unique skills from current data
export function getAllSkills(users: SkillSwapUser[]): string[] {
  const skills = new Set<string>();
  users.forEach((u) => {
    skills.add(u.skillOffered);
    skills.add(u.skillRequested);
  });
  return Array.from(skills).sort();
}

// Get all unique locations from current data
export function getAllLocations(users: SkillSwapUser[]): string[] {
  const locations = new Set<string>();
  users.forEach((u) => locations.add(u.location));
  return Array.from(locations).sort();
}
