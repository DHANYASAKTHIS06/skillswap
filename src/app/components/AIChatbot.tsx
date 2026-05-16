import { useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useApp } from "../context/AppContext";
import { useLocation } from "react-router";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "bot"; text: string; time: string }>>([
    {
      role: "bot",
      text: "Hi there! I'm your AI Skill Matcher. I can help you find the perfect tutor or guide you through your active courses.",
      time: "10:00 AM",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const { selectedSkill, courses, tutors } = useApp();
  const location = useLocation();

  const getContextualResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    // Credit system questions
    if (lowerMessage.includes("credit") || lowerMessage.includes("how does it work")) {
      return "Our credit system is simple! Students start with 50 credits. When you start a course, you pay 2 credits upfront. After completing a course, you earn 7 credits back! This encourages commitment and rewards completion.";
    }

    // Tutor suggestions
    if (
      lowerMessage.includes("tutor") ||
      lowerMessage.includes("recommend") ||
      lowerMessage.includes("suggest")
    ) {
      if (selectedSkill && selectedSkill !== "All Skills") {
        const matchingTutors = tutors.filter((t) =>
          t.skills.some((s) => s.toLowerCase().includes(selectedSkill.toLowerCase()))
        );
        if (matchingTutors.length > 0) {
          return `Based on your interest in ${selectedSkill}, I recommend ${matchingTutors[0].name} with a ${matchingTutors[0].rating} rating and ${matchingTutors[0].matchPercent}% skill match!`;
        }
      }
      return "I can help you find the perfect tutor! Try using the 'Find Tutors' page and select a skill you want to learn. I'll show you the best matches based on ratings and experience.";
    }

    // Connection status
    if (lowerMessage.includes("request") || lowerMessage.includes("status")) {
      const pendingRequests = courses.filter((c) => c.status === "requested");
      if (pendingRequests.length > 0) {
        return `You have ${pendingRequests.length} pending request(s). Waiting for tutor approval. I'll notify you once they respond!`;
      }
      return "You don't have any pending requests right now. Would you like to find a tutor?";
    }

    // Course completion
    if (lowerMessage.includes("complete") || lowerMessage.includes("finish")) {
      const completedCourses = courses.filter((c) => c.status === "completed");
      if (completedCourses.length > 0) {
        return `Great job! You've completed ${completedCourses.length} course(s). Don't forget to leave a review for your tutors!`;
      }
      return "Keep going! Complete your active courses to earn credits and unlock new learning opportunities.";
    }

    // Navigation help
    if (lowerMessage.includes("how") || lowerMessage.includes("help") || lowerMessage.includes("guide")) {
      if (location.pathname.includes("find-tutors")) {
        return "You're on the Find Tutors page! Select a skill from the dropdown, and I'll show you the best matches first, followed by other suggested tutors. Click 'Request Tutor' to start.";
      }
      return "Here's how to get started: 1) Go to 'Find Tutors' 2) Select a skill 3) Browse AI-matched tutors 4) Send a request 5) Wait for approval 6) Start learning!";
    }

    // Default response
    return "I'm here to help! You can ask me about:\n• Finding the right tutor\n• Understanding the credit system\n• Tracking your request status\n• Course navigation\n\nWhat would you like to know?";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user" as const,
      text: input,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const botResponse = {
        role: "bot" as const,
        text: getContextualResponse(input),
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const quickActions = [
    "Suggest React tutors",
    "Credit System help",
  ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 lg:bottom-6 right-6 w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-40"
      >
        <Sparkles className="h-6 w-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-20 lg:bottom-6 right-6 w-full sm:w-96 max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 z-50 flex flex-col h-[500px] mx-4 sm:mx-0">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">AI Skill Matcher</h3>
            <p className="text-xs text-blue-100">AI ASSISTANT ONLINE</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "bot" && (
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.role === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              <p
                className={`text-xs mt-1 ${
                  message.role === "user" ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-2">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-none px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2 flex-wrap">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => {
                setInput(action);
                handleSend();
              }}
              className="text-xs px-3 py-1.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask the AI Matcher..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
