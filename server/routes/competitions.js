import express from "express";
import Competition from "../models/Competition.js";
import verifyToken from "../middleware/verifyToken.js";
import User from "../models/User.js";
import Template from "../models/Template.js"; // Make sure Template model exists

const router = express.Router();

// ✅ Public: Get all competitions
router.get("/", async (req, res) => {
  try {
    let competitions = await Competition.find()
      .populate("participants", "email") // only return email
      .sort({ createdAt: 1 }); // oldest first for numbering

    // Assign competitionNumber to any competitions that don't have it
    let currentNumber = 1;
    for (let comp of competitions) {
      if (!comp.competitionNumber) {
        comp.competitionNumber = currentNumber;
        await comp.save();
      }
      currentNumber++;
    }

    // Now re-fetch sorted with newest first for display, and populate winners
    competitions = await Competition.find()
      .populate("participants", "email")
      .populate({
        path: "winners.template",
        populate: {
          path: "uploadedBy",
          select: "email username"
        }
      })
      .sort({ createdAt: -1 });

    res.json(competitions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch competitions" });
  }
});

// ✅ Public: Get single competition by ID
router.get("/:id", async (req, res) => {
  try {
    let competition = await Competition.findById(req.params.id)
      .populate("participants", "email username")
      .populate({
        path: "templates",
        populate: {
          path: "uploadedBy",
          select: "email username"
        }
      })
      .populate({
        path: "winners.template",
        populate: {
          path: "uploadedBy",
          select: "email username"
        }
      });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // If competition doesn't have a competitionNumber, assign it
    if (!competition.competitionNumber) {
      // Count all competitions ordered by createdAt to get correct number
      const allCompetitions = await Competition.find().sort({ createdAt: 1 });
      const competitionIndex = allCompetitions.findIndex(c => c._id.toString() === competition._id.toString());
      competition.competitionNumber = competitionIndex + 1;
      await competition.save();
    }

    res.json(competition);
  } catch (err) {
    console.error("Fetch competition error:", err);
    res.status(500).json({ message: "Failed to fetch competition details" });
  }
});

// Helper function to get upcoming Saturday 12:00 AM IST to Sunday 11:59:59 PM IST
const getWeekendDates = (startAfterDate = null) => {
  let now = startAfterDate ? new Date(startAfterDate) : new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  
  // Find the next Saturday
  let saturday = new Date(now);
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
  saturday.setDate(now.getDate() + daysUntilSaturday);
  saturday.setHours(0, 0, 0, 0);

  // If we're starting after a date, make sure we don't pick the same weekend
  if (startAfterDate) {
    const startAfter = new Date(startAfterDate);
    if (saturday <= startAfter) {
      saturday.setDate(saturday.getDate() + 7);
    }
  }

  // Sunday is one day later, at 23:59:59
  let sunday = new Date(saturday);
  sunday.setDate(saturday.getDate() + 1);
  sunday.setHours(23, 59, 59, 999);

  return {
    start_date: saturday,
    end_date: sunday
  };
};

// 🔒 Protected: Create competition
router.post("/", verifyToken, async (req, res) => {
  try {
    const { type, ...rest } = req.body;

    let competitionData = { ...rest, type };

    // Calculate overall competition number
    const totalCompetitions = await Competition.countDocuments();
    competitionData.competitionNumber = totalCompetitions + 1;

    if (type === "WIECODES_WEEKEND") {
      // Validate required fields for WIECODES WEEKEND
      if (!rest.requirements || !rest.challenge_question) {
        return res.status(400).json({ 
          error: "For WIECODES WEEKEND: Challenge Question and Requirements are required" 
        });
      }
      
      // Set description from requirements if needed
      competitionData.description = rest.requirements;

      // Count existing WIECODES WEEKEND competitions
      const weekendCount = await Competition.countDocuments({ type: "WIECODES_WEEKEND" });
      const newWeekendNumber = weekendCount + 1;
      const formattedWeekendNumber = String(newWeekendNumber).padStart(3, '0');
      
      competitionData.wiecodesWeekendNumber = newWeekendNumber;
      competitionData.name = `WW${formattedWeekendNumber}`;

      // Find latest (active or upcoming) WIECODES WEEKEND to schedule after
      const lastWeekend = await Competition.findOne({ type: "WIECODES_WEEKEND" }).sort({ end_date: -1 });
      
      // Automatically set dates, visibility, prize, etc.
      const dates = lastWeekend 
        ? getWeekendDates(lastWeekend.end_date) 
        : getWeekendDates();
      
      competitionData.start_date = dates.start_date;
      competitionData.end_date = dates.end_date;
      competitionData.visibility_type = "public";
      competitionData.prize = "₹1000, ₹500, ₹250, ₹150, ₹100";
      competitionData.join_code = undefined;
    } else if (type === "SPECIAL") {
      // Validate required fields for SPECIAL events
      if (!rest.requirements || !rest.challenge_question) {
        return res.status(400).json({ 
          error: "For SPECIAL events: Challenge Question and Requirements are required" 
        });
      }
      
      // Set description from requirements for consistency
      competitionData.description = rest.requirements;
    }

    const competition = new Competition(competitionData);
    await competition.save();
    res.status(201).json(competition);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// 🔒 Protected: Update competition
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { type, ...rest } = req.body;

    let updateData = { ...rest };

    if (type === "WIECODES_WEEKEND") {
      // Don't allow changing these fields for WIECODES WEEKEND
      delete updateData.start_date;
      delete updateData.end_date;
      delete updateData.visibility_type;
      delete updateData.prize;
      delete updateData.join_code;
      // But prizeLimit is allowed
    }

    const competition = await Competition.findByIdAndUpdate(
      req.params.id,
      { ...updateData, type },
      { new: true }
    );
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.json(competition);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update competition" });
  }
});

// 🔒 Protected: Delete competition
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const competition = await Competition.findByIdAndDelete(req.params.id);
    if (!competition) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.json({ message: "Competition deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete competition" });
  }
});

// 🔒 Protected: Join competition
router.post("/:id/join", verifyToken, async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // ✅ Early return if already joined
    if (competition.participants.includes(req.user.id)) {
      return res.status(200).json({
        message: "Already joined this competition",
        joined: true,
        competition,
      });
    }

    // ✅ Prevent joining if competition has already started
    const now = Date.now();
    if (now >= new Date(competition.start_date).getTime()) {
      return res.status(400).json({ message: "Cannot join competition after it has started" });
    }

    // ✅ Require join code only for custom competitions
    if (
      competition.visibility_type === "custom" &&
      competition.join_code &&
      req.body.join_code !== competition.join_code
    ) {
      return res.status(403).json({ message: "Invalid join code" });
    }

    // ✅ Add user to participants
    competition.participants.push(req.user.id);
    await competition.save();

    // ✅ Add competition to user profile
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.joinedCompetitions.includes(competition._id)) {
      user.joinedCompetitions.push(competition._id);
      await user.save();
    }

    res.status(200).json({
      message: "Successfully joined competition",
      joined: true,
      competition,
      user: {
        id: user._id,
        email: user.email,
        joinedCompetitions: user.joinedCompetitions,
      },
    });
  } catch (err) {
    console.error("Join error:", err);
    res.status(500).json({ message: "Failed to join competition" });
  }
});

// 🔒 Protected: Get user's joined competitions (returns just ids)
router.get("/my/joined", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "joinedCompetitions",
      "name description visibility_type start_date end_date"
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.joinedCompetitions.map((c) => c._id));
  } catch (err) {
    console.error("Fetch joined competitions error:", err);
    res.status(500).json({ message: "Failed to fetch joined competitions" });
  }
});

// Get templates for a competition
router.get("/:id/templates", async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate({
        path: "templates", // reference in Competition schema
        model: "Template",
        populate: {
          path: "uploadedBy", // correct field in Template schema
          select: "username email", // only return needed fields
        },
      });

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.json(competition.templates || []);
  } catch (err) {
    console.error("Fetch templates error:", err);
    res.status(500).json({ message: "Failed to fetch templates" });
  }
});


// POST /api/competitions/:id/winners
router.post("/:id/winners", async (req, res) => {
  try {
    const { winners } = req.body; // array of template IDs
    if (!Array.isArray(winners) || winners.length === 0) {
      return res.status(400).json({ message: "Winners array is required" });
    }

    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    // Replace winners with new order
    competition.winners = winners.map((templateId, index) => ({
      position: index + 1,
      template: templateId,
    }));

    await competition.save();
    res.json({ message: "Winners saved", winners: competition.winners });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


/**
 * ✅ Remove winner by position
 */
router.delete("/:id/winners/:position", verifyToken, async (req, res) => {
  try {
    const { id, position } = req.params;
    const competition = await Competition.findById(id);

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    competition.winners = competition.winners.filter(w => w.position != position);
    await competition.save();

    res.json({ message: "Winner removed", winners: competition.winners });
  } catch (err) {
    console.error("Error removing winner:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * ✅ Get winners (sorted by position)
 */
router.get("/:id/winners", async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id)
      .populate("winners.template")
      .populate("winners.user");

    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    res.json(competition.winners.sort((a, b) => a.position - b.position));
  } catch (err) {
    console.error("Error fetching winners:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// 🔒 Protected: Publish competition
router.post("/:id/publish", verifyToken, async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    if (competition.published) {
      return res.status(400).json({ message: "Competition already published" });
    }

    competition.published = true;
    await competition.save();

    res.json({ message: "Competition published successfully", competition });
  } catch (err) {
    console.error("Publish error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});
// 🔒 Protected: Unpublish competition
router.post("/:id/unpublish", verifyToken, async (req, res) => {
  try {
    const competition = await Competition.findById(req.params.id);
    if (!competition) {
      return res.status(404).json({ message: "Competition not found" });
    }

    if (!competition.published) {
      return res.status(400).json({ message: "Competition is not published" });
    }

    competition.published = false;
    await competition.save();

    res.json({ message: "Competition unpublished successfully", competition });
  } catch (err) {
    console.error("Unpublish error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});



// ✅ Public: Get weekend competition stats for loading screen
router.get("/stats/overview", async (req, res) => {
  try {
    // Get all competitions and populate templates and participants
    const allCompetitions = await Competition.find().populate("templates");
    
    // Get total competitions hosted
    const totalCompetitionsHosted = allCompetitions.length;
    
    // Get current competition week (latest competition number)
    const latestCompetition = await Competition.findOne().sort({ competitionNumber: -1 });
    const currentCompetitionWeek = latestCompetition?.competitionNumber || 0;
    
    // Calculate current and upcoming competitions
    const now = new Date();
    const currentAndUpcomingCompetitions = allCompetitions.filter(comp => {
      const startDate = new Date(comp.start_date);
      const endDate = new Date(comp.end_date);
      return now <= endDate; // Competition is either ongoing (now between start and end) or upcoming (now before start)
    });
    
    // Calculate total participants (unique users across all competitions)
    const uniqueParticipantIds = new Set();
    allCompetitions.forEach(comp => {
      comp.participants.forEach(p => uniqueParticipantIds.add(p.toString()));
    });
    const totalParticipants = uniqueParticipantIds.size;
    
    // Get all templates from competitions
    let totalProjectsSubmitted = 0;
    let totalStarsAwarded = 0;
    let totalWinnersRewarded = 0;
    
    for (const comp of allCompetitions) {
      // Count templates (projects submitted) - now we have populated templates so count them correctly
      totalProjectsSubmitted += comp.templates?.length || 0;
      
      // Count stars
      if (comp.templates) {
        comp.templates.forEach(t => {
          totalStarsAwarded += t.stars || 0;
        });
      }
      
      // Count winners
      totalWinnersRewarded += comp.winners?.length || 0;
    }
    
    res.json({
      totalParticipants,
      totalCompetitionsHosted,
      totalWinnersRewarded,
      totalProjectsSubmitted,
      totalStarsAwarded,
      currentCompetitionWeek,
      // For the loading screen stats, let's calculate some "live" numbers
      participantsOnline: Math.max(totalParticipants, 10), // Minimum 10 to look active
      challengesLoaded: currentAndUpcomingCompetitions.length,
      solutionsSubmitted: totalProjectsSubmitted
    });
  } catch (err) {
    console.error("Error fetching weekend stats:", err);
    res.status(500).json({ message: "Failed to fetch weekend stats" });
  }
});

export default router;
