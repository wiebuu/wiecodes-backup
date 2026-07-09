import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Check, X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

export interface Comment {
  id: string;
  userId: string;
  userName?: string;
  rating: number;
  text: string;
  isVerified?: boolean;
}

interface CommentsSectionProps {
  comments: Comment[];
  averageRating: number;
  onSubmit: (rating: number, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  currentUserId: string;
  userHasDownloaded?: boolean;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments = [],
  averageRating = 0,
  onSubmit,
  onDelete,
  currentUserId,
  userHasDownloaded = true,
}) => {
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // New: state for delete confirmation modal
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (userRating === 0 || reviewText.trim() === "") {
      toast.error("Please provide a rating and review text.");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(userRating, reviewText);
      setReviewText("");
      setUserRating(0);
      toast.success("Review submitted successfully!");
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Just open the confirm modal instead of window.confirm
  const handleDelete = (commentId: string) => {
    setCommentToDelete(commentId);
  };

  // Confirm deletion action
  const confirmDelete = async () => {
    if (!commentToDelete) return;
    try {
      await onDelete(commentToDelete);
      toast.success("Comment deleted.");
    } catch {
      toast.error("Failed to delete comment. Please try again.");
    } finally {
      setCommentToDelete(null);
    }
  };

  const renderStars = (filledCount: number, size = "w-4 h-4") =>
    [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={size}
        style={{
          fill: i < filledCount ? "#FFD700" : "#e5e7eb",
          color: i < filledCount ? "#FFD700" : "#e5e7eb",
        }}
        aria-hidden="true"
      />
    ));

  const getInitial = (name?: string) =>
    name && name.length > 0 ? name.charAt(0).toUpperCase() : "U";

  const renderComment = (comment: Comment) => (
    <div
      key={comment.id}
      className="flex items-start space-x-3 border-b border-gray-300 pb-4 relative pr-10"
      style={{ minHeight: "4rem" }}
    >
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primary text-white font-semibold select-none text-lg shadow-md">
        {getInitial(comment.userName)}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-gray-900">
            {comment.userName || "Unknown User"}
          </span>
          {comment.isVerified && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 select-none shadow-inner">
              <Check className="w-3 h-3" /> Verified Purchase
            </span>
          )}
        </div>
        <div
          className="flex items-center gap-1 mt-1"
          aria-label={`Rating: ${comment.rating} out of 5 stars`}
        >
          {renderStars(comment.rating)}
        </div>
        <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap leading-relaxed">
          {comment.text}
        </p>
      </div>
      {comment.userId === currentUserId && (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(comment.id)}
          aria-label="Delete comment"
          className="absolute right-0 top-2 sm:relative sm:right-auto sm:top-auto"
          style={{ zIndex: 10 }}
          title="Delete comment"
        >
          <Trash2 className="w-5 h-5 text-red-600 hover:text-red-800 transition-colors" />
        </Button>
      )}
    </div>
  );

  return (
    <Card className="transition-shadow duration-300 hover:shadow-lg border border-gray-200 rounded-lg relative">
  <CardContent className="p-4 sm:p-7 space-y-4 sm:space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between flex-wrap gap-2">
      <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-gray-900 select-none">
        Reviews & Comments
        <span className="ml-1 text-[11px] sm:text-xs bg-primary/15 text-primary px-2 sm:px-3 py-0.5 rounded-full font-medium select-none">
          {comments.length}
        </span>
      </h3>
      {comments.length > 0 && (
        <div
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-yellow-500 select-none"
          aria-label={`Average rating ${averageRating.toFixed(1)} out of 5`}
        >
          <span>{averageRating.toFixed(1)}</span>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-500" />
          <span className="text-gray-500">({comments.length} reviews)</span>
        </div>
      )}
    </div>

    {/* Note about ratings */}
    <p className="text-[11px] sm:text-xs text-gray-500 italic select-none max-w-xl leading-snug">
      These ratings are given by users on the platform and reflect overall feedback.
      Verified reviewers have separate ratings for fair comparison.
    </p>

    {/* Desktop Comments */}
    <div className="hidden sm:block space-y-4 max-h-[380px] overflow-y-auto pr-2 custom-scrollbar">
      {comments.length > 0 ? (
        comments.map(renderComment)
      ) : (
        <p className="text-sm text-gray-500 select-none">
          No reviews yet. Be the first to comment!
        </p>
      )}
    </div>

    {/* Review input */}
    {userHasDownloaded && (
      <div className="border-t border-gray-300 pt-4 sm:pt-5 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        {/* Stars */}
        <div className="flex space-x-1 mb-2 sm:mb-0" aria-label="Select your rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              onClick={() => setUserRating(star)}
              className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-transform hover:scale-110"
              style={{
                fill: userRating >= star ? "#FFD700" : "#e5e7eb",
                color: userRating >= star ? "#FFD700" : "#e5e7eb",
              }}
              aria-pressed={userRating === star}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  setUserRating(star);
                }
              }}
            />
          ))}
        </div>

        {/* Input */}
        <div className="flex flex-grow gap-2 sm:gap-3">
          <textarea
            placeholder="Write your review..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            className="flex-grow border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none resize-none shadow-sm"
            rows={1}
            style={{ minHeight: "2.5rem" }}
          />

          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="whitespace-nowrap rounded-full px-4 sm:px-6 py-1.5 sm:py-2 shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </div>
    )}

    {/* Mobile Button */}
    <div className="sm:hidden">
      <Button
        variant="outline"
        size="sm"
        className="w-full rounded-full font-medium text-sm py-2"
        onClick={() => setIsCommentsOpen(true)}
      >
        View All Reviews ({comments.length})
      </Button>
    </div>

    {/* Mobile Modal */}
    <AnimatePresence>
      {isCommentsOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className="bg-white w-full h-[90vh] sm:h-auto sm:rounded-lg sm:max-w-lg flex flex-col relative rounded-t-2xl shadow-xl"
          >
            {/* Close button */}
            <button
              className="absolute top-3 right-3 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition z-20"
              onClick={() => setIsCommentsOpen(false)}
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Scrollable Comments */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 sm:space-y-6 custom-scrollbar">
              {comments.length > 0 ? (
                comments.map(renderComment)
              ) : (
                <p className="text-sm text-gray-500 select-none">
                  No reviews yet. Be the first to comment!
                </p>
              )}
            </div>

            {/* Comment Form */}
            {userHasDownloaded && (
              <div className="border-t border-gray-300 p-4 sm:p-5 sticky bottom-0 z-10 bg-white flex flex-col sm:flex-row sm:items-center sm:gap-4">
                {/* Stars */}
                <div className="flex space-x-1 mb-2 sm:mb-0">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      onClick={() => setUserRating(star)}
                      className="w-6 h-6 sm:w-7 sm:h-7 cursor-pointer transition-transform hover:scale-110"
                      style={{
                        fill: userRating >= star ? "#FFD700" : "#e5e7eb",
                        color: userRating >= star ? "#FFD700" : "#e5e7eb",
                      }}
                    />
                  ))}
                </div>

                {/* Input */}
                <div className="flex flex-grow gap-2 sm:gap-3">
                  <textarea
                    placeholder="Write your review..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-primary outline-none resize-none shadow-sm"
                    rows={1}
                  />

                  <Button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="whitespace-nowrap rounded-full px-4 sm:px-6 py-1.5 sm:py-2 shadow-md hover:shadow-lg transition-shadow text-sm sm:text-base"
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Delete Confirmation Modal */}
    {commentToDelete && (
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <div className="bg-white rounded-lg p-5 sm:p-6 max-w-sm mx-4 text-center shadow-lg">
          <p className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold text-gray-900">
            Are you sure you want to delete this comment?
          </p>
          <div className="flex justify-center gap-3 sm:gap-4">
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 transition text-sm sm:text-base"
              onClick={confirmDelete}
            >
              Yes
            </button>
            <button
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded border border-gray-300 hover:bg-gray-100 transition text-sm sm:text-base"
              onClick={() => setCommentToDelete(null)}
            >
              No
            </button>
          </div>
        </div>
      </div>
    )}
  </CardContent>
</Card>

  );
};

export default CommentsSection;
