import { Star } from "lucide-react";

export default function Reviews() {
  const reviews = [
    {
      id: 1,
      student: "Alex Rivera",
      course: "Advanced React Patterns",
      rating: 5,
      comment: "Excellent teaching! Very clear explanations.",
      date: "2 days ago",
    },
    {
      id: 2,
      student: "Jordan Smith",
      course: "Python Basics",
      rating: 5,
      comment: "Patient and knowledgeable tutor.",
      date: "1 week ago",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">Feedback from your students</p>
      </div>

      <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl p-8 text-white">
        <p className="text-sm opacity-80 mb-2">Average Rating</p>
        <div className="flex items-center gap-3">
          <p className="text-5xl font-bold">4.9</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 fill-white" />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="font-semibold">{review.student}</p>
                <p className="text-sm text-gray-500">{review.course}</p>
              </div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i <= review.rating
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{review.comment}</p>
            <p className="text-sm text-gray-500">{review.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
