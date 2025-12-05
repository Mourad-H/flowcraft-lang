// curriculumData.js
const RAW_LESSONS = [
   // ... الصق كل الدروس (من 1 إلى 500) هنا داخل المصفوفة ...
   { "id": 1, ... },
   // ...
   { "id": 500, ... }

    {
      "id": 1,
      "title": "The Shinobi Academy Entrance",
      "topic": "Hiragana: A-row (あいうえお)",
      "context": "First day at the ninja academy, learning to write your name on the attendance scroll",
      "type": "TEACH"
    },
    {
      "id": 2,
      "title": "Chakra Control: The Basics",
      "topic": "Hiragana: K-row (かきくけこ)",
      "context": "Sensei writes chakra control techniques on the blackboard in hiragana",
      "type": "TEACH"
    },
    {
      "id": 3,
      "title": "Meeting Your Rival",
      "topic": "Hiragana: S-row (さしすせそ)",
      "context": "Reading your rival's challenge letter written in simple hiragana",
      "type": "TEACH"
    },
    {
      "id": 4,
      "title": "The Ramen Stand Order",
      "topic": "Hiragana: T-row (たちつてと)",
      "context": "Naruto ordering ramen at Ichiraku, reading the menu in hiragana",
      "type": "TEACH"
    },
    {
      "id": 5,
      "title": "Genin Qualification Exam: Part 1",
      "topic": "Review: Hiragana A-T rows",
      "context": "Written exam to qualify for genin rank, testing basic hiragana knowledge",
      "type": "EXAM"
    },
    {
      "id": 6,
      "title": "Training Ground Assignment",
      "topic": "Hiragana: N-row (なにぬねの)",
      "context": "Reading the training ground assignment notice posted at the academy",
      "type": "TEACH"
    },
    {
      "id": 7,
      "title": "The Weapon Shop Visit",
      "topic": "Hiragana: H-row (はひふへほ)",
      "context": "Shopping for kunai and shuriken, reading item labels in hiragana",
      "type": "TEACH"
    },
    {
      "id": 8,
      "title": "Morning Assembly Announcement",
      "topic": "Hiragana: M-row (まみむめも)",
      "context": "The principal announces the team formations at morning assembly",
      "type": "TEACH"
    },
    {
      "id": 9,
      "title": "Your First Team Mission Scroll",
      "topic": "Hiragana: Y-row (やゆよ)",
      "context": "Receiving your first D-rank mission, reading the scroll details",
      "type": "TEACH"
    },
    {
      "id": 10,
      "title": "Bell Test Challenge",
      "topic": "Review: Hiragana N-Y rows",
      "context": "Kakashi's bell test with written clues in hiragana scattered around",
      "type": "EXAM"
    },
    {
      "id": 11,
      "title": "The Bridge Builder's Request",
      "topic": "Hiragana: R-row (らりるれろ)",
      "context": "Reading the mission request from Tazuna written in simple hiragana",
      "type": "TEACH"
    },
    {
      "id": 12,
      "title": "Lunch Break at the Academy",
      "topic": "Hiragana: W-row & N (わをん)",
      "context": "Reading lunch menu and notes from classmates during break",
      "type": "TEACH"
    },
    {
      "id": 13,
      "title": "The Mysterious Jutsu Scroll",
      "topic": "Hiragana: Dakuten (がぎぐげご, etc.)",
      "context": "Discovering an old jutsu scroll with voiced consonants in the library",
      "type": "TEACH"
    },
    {
      "id": 14,
      "title": "Summoning Contract Basics",
      "topic": "Hiragana: Handakuten (ぱぴぷぺぽ)",
      "context": "Learning about summoning contracts written with special characters",
      "type": "TEACH"
    },
    {
      "id": 15,
      "title": "Chunin Exam Application",
      "topic": "Review: Complete Hiragana Chart",
      "context": "Filling out the chunin exam application form entirely in hiragana",
      "type": "EXAM"
    },
    {
      "id": 16,
      "title": "Greeting Your Sensei",
      "topic": "Basic Greetings: おはよう, こんにちは, こんばんは",
      "context": "Meeting your jonin sensei for the first time at different times of day",
      "type": "TEACH"
    },
    {
      "id": 17,
      "title": "The Hokage's Office",
      "topic": "Formal Greetings: おはようございます, ありがとうございます",
      "context": "Visiting the Hokage's office and using polite language with superiors",
      "type": "TEACH"
    },
    {
      "id": 18,
      "title": "Training Dojo Etiquette",
      "topic": "Situational Greetings: いただきます, ごちそうさま, おやすみ",
      "context": "Following proper etiquette during training and meals at the dojo",
      "type": "TEACH"
    },
    {
      "id": 19,
      "title": "Meeting Teammates",
      "topic": "Introduction Greetings: はじめまして, よろしく",
      "context": "First team meeting after team assignments are announced",
      "type": "TEACH"
    },
    {
      "id": 20,
      "title": "Village Gate Duty",
      "topic": "Review: All Basic Greetings",
      "context": "Your first mission guarding the village gate, greeting various visitors",
      "type": "EXAM"
    },
    {
      "id": 21,
      "title": "Introducing Yourself to the Class",
      "topic": "Self-Introduction: わたしは [name] です",
      "context": "Transfer student scenario introducing yourself to the ninja academy class",
      "type": "TEACH"
    },
    {
      "id": 22,
      "title": "Team Formation Day",
      "topic": "Self-Introduction: [name] といいます",
      "context": "Introducing yourself to your new three-man cell teammates",
      "type": "TEACH"
    },
    {
      "id": 23,
      "title": "My Ninja Way Declaration",
      "topic": "Describing Yourself: わたしは [occupation] です",
      "context": "Naruto-style declaration of your ninja way and dream at the academy",
      "type": "TEACH"
    },
    {
      "id": 24,
      "title": "The Rookie Tournament",
      "topic": "Age and Grade: [number] さいです, [grade] です",
      "context": "Registering for the rookie tournament at the academy sports festival",
      "type": "TEACH"
    },
    {
      "id": 25,
      "title": "Academy Graduation Ceremony",
      "topic": "Review: Complete Self-Introduction",
      "context": "Graduation ceremony where each student gives a full self-introduction",
      "type": "EXAM"
    },
    {
      "id": 26,
      "title": "This is My Headband",
      "topic": "Particle は (wa): Topic Marker",
      "context": "Receiving your forehead protector and explaining what it means to you",
      "type": "TEACH"
    },
    {
      "id": 27,
      "title": "Whose Kunai Is This?",
      "topic": "Particle の (no): Possession",
      "context": "After sparring, identifying whose weapons belong to whom",
      "type": "TEACH"
    },
    {
      "id": 28,
      "title": "The Village of Leaves",
      "topic": "Particle の (no): Connecting Nouns",
      "context": "Learning about different villages: Konoha no sato, Hi no kuni",
      "type": "TEACH"
    },
    {
      "id": 29,
      "title": "Is That Your Summoning Animal?",
      "topic": "Particle か (ka): Question Marker",
      "context": "Encountering various summoning animals and asking about them",
      "type": "TEACH"
    },
    {
      "id": 30,
      "title": "Mission Assignment Briefing",
      "topic": "Review: Particles は, の, か",
      "context": "Hokage briefs your team on a mission using these basic particles",
      "type": "EXAM"
    },
    {
      "id": 31,
      "title": "I Also Want to Be Hokage",
      "topic": "Particle も (mo): Also/Too",
      "context": "Naruto's dream inspires others to share their dreams using も",
      "type": "TEACH"
    },
    {
      "id": 32,
      "title": "Where Is the Training Ground?",
      "topic": "Location Particle: に (ni)",
      "context": "Lost on your way to the training ground, asking for directions",
      "type": "TEACH"
    },
    {
      "id": 33,
      "title": "Going to the Ramen Shop",
      "topic": "Direction Particle: へ (e)",
      "context": "Team decides to go to Ichiraku Ramen after training",
      "type": "TEACH"
    },
    {
      "id": 34,
      "title": "Training With Kunai",
      "topic": "Particle を (wo): Direct Object",
      "context": "Training session focusing on throwing kunai at targets",
      "type": "TEACH"
    },
    {
      "id": 35,
      "title": "The Lost Pet Mission",
      "topic": "Review: Particles も, に, へ, を",
      "context": "D-rank mission to find a lost pet using direction and location words",
      "type": "EXAM"
    },
    {
      "id": 36,
      "title": "What the Sensei Does",
      "topic": "Present Tense Verbs: ます form basics",
      "context": "Observing what your sensei does during a typical training day",
      "type": "TEACH"
    },
    {
      "id": 37,
      "title": "Daily Training Routine",
      "topic": "Common Verbs: たべます, のみます, します",
      "context": "Describing Rock Lee's intense daily training and eating schedule",
      "type": "TEACH"
    },
    {
      "id": 38,
      "title": "Academy Schedule",
      "topic": "More Verbs: いきます, きます, かえります",
      "context": "Discussing when you go to, come to, and return from the academy",
      "type": "TEACH"
    },
    {
      "id": 39,
      "title": "What We Learn at the Academy",
      "topic": "Study Verbs: べんきょうします, よみます, かきます",
      "context": "Describing different subjects studied at the ninja academy",
      "type": "TEACH"
    },
    {
      "id": 40,
      "title": "Mission Report Presentation",
      "topic": "Review: Basic Present Tense Verbs",
      "context": "Delivering your first mission report to the Hokage in simple Japanese",
      "type": "EXAM"
    },
    {
      "id": 41,
      "title": "Tomorrow's Team Training",
      "topic": "Future Tense: ます form for future",
      "context": "Planning tomorrow's training session with your team",
      "type": "TEACH"
    },
    {
      "id": 42,
      "title": "The Upcoming Chunin Exams",
      "topic": "Future Events: [time] に [verb]ます",
      "context": "Discussing when the chunin exams will take place",
      "type": "TEACH"
    },
    {
      "id": 43,
      "title": "I Don't Eat Vegetables",
      "topic": "Negative Present: ません",
      "context": "Naruto complaining about vegetables at dinner after training",
      "type": "TEACH"
    },
    {
      "id": 44,
      "title": "Can't Use That Jutsu Yet",
      "topic": "Ability Verbs: できます/できません",
      "context": "Discussing which jutsu you can and cannot perform yet",
      "type": "TEACH"
    },
    {
      "id": 45,
      "title": "Pre-Mission Briefing",
      "topic": "Review: Future and Negative Forms",
      "context": "Detailed mission briefing discussing what will and won't happen",
      "type": "EXAM"
    },
    {
      "id": 46,
      "title": "Counting Kunai",
      "topic": "Numbers 1-10: いち to じゅう",
      "context": "Inventory check of weapons before heading out on a mission",
      "type": "TEACH"
    },
    {
      "id": 47,
      "title": "Training Ground Number",
      "topic": "Numbers 11-20",
      "context": "Finding the correct training ground among many in the village",
      "type": "TEACH"
    },
    {
      "id": 48,
      "title": "Team Assignment Numbers",
      "topic": "Numbers up to 100",
      "context": "Learning about all the different teams from Academy days (Team 7, 8, 10, etc.)",
      "type": "TEACH"
    },
    {
      "id": 49,
      "title": "How Many Clones?",
      "topic": "Counting with Counters: ひとつ, ふたつ",
      "context": "Naruto's shadow clone jutsu counting how many clones are created",
      "type": "TEACH"
    },
    {
      "id": 50,
      "title": "Equipment Procurement Mission",
      "topic": "Review: Numbers and Basic Counting",
      "context": "Shopping mission to buy exact quantities of ninja equipment",
      "type": "EXAM"
    },
    {
      "id": 51,
      "title": "What Time Is Training?",
      "topic": "Time: [number]じ (o'clock)",
      "context": "Checking what time morning training starts with Sensei",
      "type": "TEACH"
    },
    {
      "id": 52,
      "title": "Mission Departure Time",
      "topic": "Minutes: [number]ふん/ぷん",
      "context": "Kakashi telling the team the exact departure time for the mission",
      "type": "TEACH"
    },
    {
      "id": 53,
      "title": "Days of the Week at Academy",
      "topic": "Days: げつようび to にちようび",
      "context": "Weekly academy schedule with different classes each day",
      "type": "TEACH"
    },
    {
      "id": 54,
      "title": "How Long Until the Festival?",
      "topic": "Dates and Months basics",
      "context": "Counting down to the village festival where genin demonstrate skills",
      "type": "TEACH"
    },
    {
      "id": 55,
      "title": "The Punctual Ninja Exam",
      "topic": "Review: Time, Days, Dates",
      "context": "Exam tests timing precision - arriving exactly on time for missions",
      "type": "EXAM"
    },
    {
      "id": 56,
      "title": "Help! I'm Lost in the Village",
      "topic": "Survival Phrase: すみません (Excuse me)",
      "context": "Lost in Konoha village on your first day, needing to ask for help",
      "type": "TEACH"
    },
    {
      "id": 57,
      "title": "Understanding the Mission Brief",
      "topic": "Survival Phrase: もういちどおねがいします",
      "context": "Mission briefing is too fast, asking the Hokage to repeat",
      "type": "TEACH"
    },
    {
      "id": 58,
      "title": "At the Hospital After Training",
      "topic": "Survival Phrase: たすけて, だいじょうぶ",
      "context": "Training accident sends you to see Tsunade at the hospital",
      "type": "TEACH"
    },
    {
      "id": 59,
      "title": "I Don't Understand the Jutsu",
      "topic": "Survival Phrase: わかりません, わかりました",
      "context": "Learning a complex jutsu from your sensei for the first time",
      "type": "TEACH"
    },
    {
      "id": 60,
      "title": "Emergency Mission Communication",
      "topic": "Review: Essential Survival Phrases",
      "context": "Emergency C-rank mission requiring quick communication skills",
      "type": "EXAM"
    },
    {
      "id": 61,
      "title": "Apologizing to the Hokage",
      "topic": "Apologies: ごめんなさい, すみません, しつれいします",
      "context": "After pulling a prank like Naruto, apologizing to authority figures",
      "type": "TEACH"
    },
    {
      "id": 62,
      "title": "Accepting Team Leader's Orders",
      "topic": "Acknowledgment: はい, わかりました, かしこまりました",
      "context": "Following your jonin sensei's instructions during field training",
      "type": "TEACH"
    },
    {
      "id": 63,
      "title": "Politely Declining a Mission",
      "topic": "Refusal: いいえ, ちがいます, ちょっと...",
      "context": "When offered a mission that conflicts with important training",
      "type": "TEACH"
    },
    {
      "id": 64,
      "title": "Making Requests to Teammates",
      "topic": "Requests: [verb]てください (please do)",
      "context": "Coordinating team attack strategy during sparring practice",
      "type": "TEACH"
    },
    {
      "id": 65,
      "title": "Teamwork Coordination Drill",
      "topic": "Review: Social Interaction Phrases",
      "context": "Complex team exercise requiring polite requests and acknowledgments",
      "type": "EXAM"
    },
    {
      "id": 66,
      "title": "I Like Ramen",
      "topic": "Preferences: すきです, きらいです",
      "context": "Team bonding at Ichiraku discussing favorite and disliked foods",
      "type": "TEACH"
    },
    {
      "id": 67,
      "title": "My Favorite Jutsu Type",
      "topic": "Preferences with Nouns: [noun]がすきです",
      "context": "Discussing specializations: taijutsu, ninjutsu, or genjutsu",
      "type": "TEACH"
    },
    {
      "id": 68,
      "title": "Training Is Hard But Fun",
      "topic": "Describing Things: [adjective]です",
      "context": "Reflecting on your first week of genin training with the team",
      "type": "TEACH"
    },
    {
      "id": 69,
      "title": "How Was the Mission?",
      "topic": "Past Experiences: どうでしたか responses",
      "context": "Debriefing after your first real mission outside the village",
      "type": "TEACH"
    },
    {
      "id": 70,
      "title": "Team Compatibility Assessment",
      "topic": "Review: Expressing Preferences and Feelings",
      "context": "Psychological evaluation of team dynamics and compatibility",
      "type": "EXAM"
    },
    {
      "id": 71,
      "title": "Where Is the Weapon?",
      "topic": "Location Words: ここ, そこ, あそこ",
      "context": "Hide and seek training exercise to improve stealth awareness",
      "type": "TEACH"
    },
    {
      "id": 72,
      "title": "Which Path Should We Take?",
      "topic": "Direction Words: みぎ, ひだり, まっすぐ",
      "context": "Navigation exercise in the Forest of Death during training",
      "type": "TEACH"
    },
    {
      "id": 73,
      "title": "This Jutsu vs That Jutsu",
      "topic": "Demonstratives: この, その, あの",
      "context": "Sensei demonstrating different jutsu and having you identify them",
      "type": "TEACH"
    },
    {
      "id": 74,
      "title": "How Many Scrolls?",
      "topic": "Quantities: たくさん, すこし, ぜんぶ",
      "context": "Organizing mission scrolls in the Hokage's office for a D-rank task",
      "type": "TEACH"
    },
    {
      "id": 75,
      "title": "Scroll Retrieval Mission",
      "topic": "Review: Location, Direction, Demonstratives",
      "context": "Mission to retrieve specific scrolls from various locations in village",
      "type": "EXAM"
    },
    {
      "id": 76,
      "title": "My Sensei Is Strong",
      "topic": "Adjectives: つよい, よわい, おおきい, ちいさい",
      "context": "Comparing different jonin senseis and their abilities",
      "type": "TEACH"
    },
    {
      "id": 77,
      "title": "Today's Weather Training",
      "topic": "Weather/Condition Words: あつい, さむい, いい, わるい",
      "context": "Training continues in all weather conditions - describing each day",
      "type": "TEACH"
    },
    {
      "id": 78,
      "title": "The New Kunai Set",
      "topic": "Adjective Modifiers: とても, あまり",
      "context": "Reviewing new equipment at the ninja weapon shop",
      "type": "TEACH"
    },
    {
      "id": 79,
      "title": "Comparing Team Members",
      "topic": "Comparisons: [A]より[B]のほうが",
      "context": "Friendly rivalry - comparing abilities between teammates",
      "type": "TEACH"
    },
    {
      "id": 80,
      "title": "Mission Difficulty Assessment",
      "topic": "Review: Descriptive Adjectives and Comparisons",
      "context": "Evaluating and describing various D-rank missions before selection",
      "type": "EXAM"
    },
    {
      "id": 81,
      "title": "Because Training Is Important",
      "topic": "Reason: から (because)",
      "context": "Explaining to friends why you can't hang out due to training",
      "type": "TEACH"
    },
    {
      "id": 82,
      "title": "But I'm Not Strong Yet",
      "topic": "Contradiction: でも, けど (but)",
      "context": "Discussing your progress with sensei - acknowledging both growth and limits",
      "type": "TEACH"
    },
    {
      "id": 83,
      "title": "If It Rains Tomorrow",
      "topic": "Conditional: [verb]たら (if/when)",
      "context": "Planning backup training locations in case of bad weather",
      "type": "TEACH"
    },
    {
      "id": 84,
      "title": "And Then We Completed the Mission",
      "topic": "Sequence: そして, それから (and then)",
      "context": "Narrating your first successful mission from start to finish",
      "type": "TEACH"
    },
    {
      "id": 85,
      "title": "Mission Report Composition",
      "topic": "Review: Connecting Phrases and Logic",
      "context": "Writing a comprehensive mission report with proper connectors",
      "type": "EXAM"
    },
    {
      "id": 86,
      "title": "I Want to Become Stronger",
      "topic": "Desire: [verb]たいです (want to)",
      "context": "Setting personal ninja goals with your sensei after evaluation",
      "type": "TEACH"
    },
    {
      "id": 87,
      "title": "Let's Train Together",
      "topic": "Invitation: [verb]ましょう (let's)",
      "context": "Inviting teammates to extra training sessions outside regular hours",
      "type": "TEACH"
    },
    {
      "id": 88,
      "title": "You Should Rest",
      "topic": "Suggestion: [verb]たほうがいいです (should)",
      "context": "Team medic advising injured teammate to rest before next mission",
      "type": "TEACH"
    },
    {
      "id": 89,
      "title": "Must Complete the Mission",
      "topic": "Obligation: [verb]なければなりません (must)",
      "context": "Understanding the ninja way and duties that must be fulfilled",
      "type": "TEACH"
    },
    {
      "id": 90,
      "title": "Team Strategy Meeting",
      "topic": "Review: Expressing Wants, Suggestions, Obligations",
      "context": "Planning session for upcoming difficult C-rank mission",
      "type": "EXAM"
    },
    {
      "id": 91,
      "title": "My Dream Is to Protect Everyone",
      "topic": "Advanced Self-Introduction: Goals and Dreams",
      "context": "Graduation speech expressing your ninja way and future goals",
      "type": "TEACH"
    },
    {
      "id": 92,
      "title": "Our Team's Specialty",
      "topic": "Talking About Groups: わたしたち, ぼくら",
      "context": "Describing your three-man cell's strengths to another team",
      "type": "TEACH"
    },
    {
      "id": 93,
      "title": "Understanding Mission Ranks",
      "topic": "Vocabulary: Mission Classifications D to S rank",
      "context": "Learning about different mission difficulties and requirements",
      "type": "TEACH"
    },
    {
      "id": 94,
      "title": "Ninja Tool Names",
      "topic": "Essential Vocabulary: Kunai, Shuriken, Jutsu words",
      "context": "Equipment class learning proper names for all ninja tools",
      "type": "TEACH"
    },
    {
      "id": 95,
      "title": "First C-Rank Mission Briefing",
      "topic": "Review: Complex Mission Communication",
      "context": "Receiving and understanding your first C-rank mission outside village",
      "type": "EXAM"
    },
    {
      "id": 96,
      "title": "Reading Mission Scrolls",
      "topic": "Reading Practice: Simple mission reports in hiragana",
      "context": "Archive duty - reading old mission scrolls to learn from past",
      "type": "TEACH"
    },
    {
      "id": 97,
      "title": "Writing to Your Family",
      "topic": "Writing Practice: Simple letter composition",
      "context": "Writing home during your first multi-day mission away from village",
      "type": "TEACH"
    },
    {
      "id": 98,
      "title": "Listening to Battle Instructions",
      "topic": "Listening Comprehension: Following rapid commands",
      "context": "High-intensity training where sensei gives quick instructions",
      "type": "TEACH"
    },
    {
      "id": 99,
      "title": "Speaking Under Pressure",
      "topic": "Speaking Practice: Communicating during emergencies",
      "context": "Simulation of emergency situations requiring clear communication",
      "type": "TEACH"
    },
    {
      "id": 100,
      "title": "Genin Graduation: The Final Trial",
      "topic": "Comprehensive Review: All Genin Arc Skills",
      "context": "Final comprehensive exam covering all basics before advancing to Chunin Arc",
      "type": "EXAM"
    },

    {
      "id": 101,
      "title": "The Journey Begins",
      "topic": "Te-form Introduction: [verb]て",
      "context": "Preparing for your first journey outside the village, connecting actions",
      "type": "TEACH"
    },
    {
      "id": 102,
      "title": "Walking and Talking on the Road",
      "topic": "Te-form: Simultaneous Actions",
      "context": "Traveling to the Land of Waves while discussing strategy with team",
      "type": "TEACH"
    },
    {
      "id": 103,
      "title": "Please Check the Map",
      "topic": "Te-form Requests: [verb]てください",
      "context": "Asking teammates to help with navigation during travel",
      "type": "TEACH"
    },
    {
      "id": 104,
      "title": "Setting Up Camp for the Night",
      "topic": "Te-form Sequences: [verb]て、[verb]て",
      "context": "Coordinating team tasks when making camp in the wilderness",
      "type": "TEACH"
    },
    {
      "id": 105,
      "title": "Ambush at the Border",
      "topic": "Review: Te-form Basics and Usage",
      "context": "Combat scenario requiring rapid coordinated commands using te-form",
      "type": "EXAM"
    },
    {
      "id": 106,
      "title": "Yesterday's Battle",
      "topic": "Past Tense Introduction: [verb]ました",
      "context": "Debriefing with Hokage about what happened during the mission",
      "type": "TEACH"
    },
    {
      "id": 107,
      "title": "What We Ate on the Road",
      "topic": "Past Tense: Regular Verbs",
      "context": "Discussing meals and experiences from your journey at Ichiraku",
      "type": "TEACH"
    },
    {
      "id": 108,
      "title": "The Enemy We Encountered",
      "topic": "Past Tense: Irregular Verbs",
      "context": "Reporting on unexpected enemy encounters during the mission",
      "type": "TEACH"
    },
    {
      "id": 109,
      "title": "We Didn't Go That Way",
      "topic": "Past Negative: [verb]ませんでした",
      "context": "Explaining why the team took an alternate route through the forest",
      "type": "TEACH"
    },
    {
      "id": 110,
      "title": "Mission Report: The Wave Country",
      "topic": "Review: Past Tense Conjugations",
      "context": "Comprehensive mission report using past tense to describe all events",
      "type": "EXAM"
    },
    {
      "id": 111,
      "title": "I Fought and Won",
      "topic": "Ta-form Introduction: Casual Past",
      "context": "Casual conversation with friends about recent sparring matches",
      "type": "TEACH"
    },
    {
      "id": 112,
      "title": "After Eating, We Left",
      "topic": "Ta-form Sequence: [verb]たあとで",
      "context": "Describing the sequence of events during a rest stop at a tea house",
      "type": "TEACH"
    },
    {
      "id": 113,
      "title": "I've Been to That Village",
      "topic": "Experience: [verb]たことがあります",
      "context": "Sharing travel experiences with teammates about different lands",
      "type": "TEACH"
    },
    {
      "id": 114,
      "title": "If You've Finished Training",
      "topic": "Conditional Ta-form: [verb]たら",
      "context": "Sensei explaining what happens after completing certain training levels",
      "type": "TEACH"
    },
    {
      "id": 115,
      "title": "Traveler's Tales Competition",
      "topic": "Review: Ta-form All Uses",
      "context": "Team sharing session where everyone describes past adventures",
      "type": "EXAM"
    },
    {
      "id": 116,
      "title": "There Is an Inn Ahead",
      "topic": "Existence: あります (Inanimate)",
      "context": "Finding lodging and supplies during travel between villages",
      "type": "TEACH"
    },
    {
      "id": 117,
      "title": "Enemy Ninja Are Here",
      "topic": "Existence: います (Animate)",
      "context": "Reporting enemy positions during reconnaissance mission",
      "type": "TEACH"
    },
    {
      "id": 118,
      "title": "Where Is the Market?",
      "topic": "Location Questions: どこにありますか/いますか",
      "context": "Asking locals for directions in an unfamiliar village",
      "type": "TEACH"
    },
    {
      "id": 119,
      "title": "My Kunai Is in My Pouch",
      "topic": "Possession with Existence: [place]に[thing]があります",
      "context": "Inventory check before mission to confirm all equipment is present",
      "type": "TEACH"
    },
    {
      "id": 120,
      "title": "Reconnaissance Report",
      "topic": "Review: Existence Verbs and Location",
      "context": "Detailed report on enemy positions and available resources in area",
      "type": "EXAM"
    },
    {
      "id": 121,
      "title": "Counting Explosive Tags",
      "topic": "Counter: まい (Flat Objects)",
      "context": "Purchasing explosive tags at the weapons shop before mission",
      "type": "TEACH"
    },
    {
      "id": 122,
      "title": "How Many Enemies?",
      "topic": "Counter: にん/人 (People)",
      "context": "Scouting mission to count enemy forces near the border",
      "type": "TEACH"
    },
    {
      "id": 123,
      "title": "Three Bottles of Soldier Pills",
      "topic": "Counter: ほん/本 (Cylindrical Objects)",
      "context": "Medical supplies shopping before long-distance mission",
      "type": "TEACH"
    },
    {
      "id": 124,
      "title": "Small Animals in the Forest",
      "topic": "Counter: ひき/匹 (Small Animals)",
      "context": "Survival training to catch food during wilderness missions",
      "type": "TEACH"
    },
    {
      "id": 125,
      "title": "Supply Procurement Mission",
      "topic": "Review: Essential Counters",
      "context": "Shopping mission requiring precise counting of various items",
      "type": "EXAM"
    },
    {
      "id": 126,
      "title": "The Sword Is Heavy",
      "topic": "I-Adjectives Present: [adj]い",
      "context": "Trying out different weapons at the legendary blacksmith's forge",
      "type": "TEACH"
    },
    {
      "id": 127,
      "title": "This Ramen Is Delicious",
      "topic": "I-Adjectives: おいしい, まずい, あたらしい, ふるい",
      "context": "Food tasting at various roadside stands during travel",
      "type": "TEACH"
    },
    {
      "id": 128,
      "title": "Yesterday's Training Was Hard",
      "topic": "I-Adjectives Past: [adj]かった",
      "context": "Reflecting on intensive training session with team the previous day",
      "type": "TEACH"
    },
    {
      "id": 129,
      "title": "It Wasn't Expensive",
      "topic": "I-Adjectives Negative Past: [adj]くなかった",
      "context": "Discussing good deals found at the traveling merchant's caravan",
      "type": "TEACH"
    },
    {
      "id": 130,
      "title": "Shopping District Adventure",
      "topic": "Review: I-Adjectives All Forms",
      "context": "Exploring new village's market and describing everything you see",
      "type": "EXAM"
    },
    {
      "id": 131,
      "title": "The Forest Is Dangerous",
      "topic": "Na-Adjectives Present: [adj]な",
      "context": "Sensei warning about the hazards of the Valley of the End",
      "type": "TEACH"
    },
    {
      "id": 132,
      "title": "That Jutsu Is Amazing",
      "topic": "Common Na-Adjectives: すてき, きれい, ゆうめい",
      "context": "Watching legendary ninja demonstrate their signature techniques",
      "type": "TEACH"
    },
    {
      "id": 133,
      "title": "The Village Was Peaceful",
      "topic": "Na-Adjectives Past: [adj]だった",
      "context": "Describing how a village looked before it was attacked",
      "type": "TEACH"
    },
    {
      "id": 134,
      "title": "It Wasn't Convenient",
      "topic": "Na-Adjectives Negative Past: [adj]じゃなかった",
      "context": "Discussing problems with the previous campsite location",
      "type": "TEACH"
    },
    {
      "id": 135,
      "title": "Travel Journal Entry",
      "topic": "Review: Na-Adjectives All Forms",
      "context": "Writing detailed journal entry describing places and experiences",
      "type": "EXAM"
    },
    {
      "id": 136,
      "title": "Which Road Should We Take?",
      "topic": "Asking Directions: [place]はどこですか",
      "context": "Lost at a crossroads, asking travelers for the correct path",
      "type": "TEACH"
    },
    {
      "id": 137,
      "title": "Go Straight Then Turn Right",
      "topic": "Direction Instructions: まっすぐ、みぎ、ひだり",
      "context": "Following directions given by locals to find hidden training ground",
      "type": "TEACH"
    },
    {
      "id": 138,
      "title": "It's Near the Bridge",
      "topic": "Relative Location: [place]のちかく/となり/まえ",
      "context": "Searching for specific locations using landmarks in foreign village",
      "type": "TEACH"
    },
    {
      "id": 139,
      "title": "How Do I Get There?",
      "topic": "Transportation: [verb]ていく/[verb]てくる",
      "context": "Planning travel routes between distant villages for mission",
      "type": "TEACH"
    },
    {
      "id": 140,
      "title": "Lost in the Capital",
      "topic": "Review: Directions and Navigation",
      "context": "Complex navigation challenge in large unfamiliar city",
      "type": "EXAM"
    },
    {
      "id": 141,
      "title": "I'd Like Three Kunai Please",
      "topic": "Shopping: [item]をください",
      "context": "Purchasing weapons at a shop in the Land of Iron",
      "type": "TEACH"
    },
    {
      "id": 142,
      "title": "How Much Is This Scroll?",
      "topic": "Prices: いくらですか、[number]えん",
      "context": "Bargaining at the antique jutsu scroll market",
      "type": "TEACH"
    },
    {
      "id": 143,
      "title": "Do You Have Smoke Bombs?",
      "topic": "Availability: [item]がありますか",
      "context": "Searching for specific ninja tools at various shops",
      "type": "TEACH"
    },
    {
      "id": 144,
      "title": "It's Too Expensive",
      "topic": "Shopping Opinions: たかすぎます、やすい",
      "context": "Evaluating prices at different merchants along the trade route",
      "type": "TEACH"
    },
    {
      "id": 145,
      "title": "Market Day Supply Run",
      "topic": "Review: Shopping Interactions",
      "context": "Mission to purchase specific items within budget at busy market",
      "type": "EXAM"
    },
    {
      "id": 146,
      "title": "I'll Have the Ramen Special",
      "topic": "Ordering Food: [food]をおねがいします",
      "context": "Ordering at restaurants in different villages during travel",
      "type": "TEACH"
    },
    {
      "id": 147,
      "title": "What Do You Recommend?",
      "topic": "Menu Questions: おすすめは？なにがいいですか",
      "context": "Trying local specialties at an unfamiliar regional restaurant",
      "type": "TEACH"
    },
    {
      "id": 148,
      "title": "No Vegetables Please",
      "topic": "Food Preferences: [food]ぬきで、[food]おおめ",
      "context": "Customizing orders at food stalls based on dietary preferences",
      "type": "TEACH"
    },
    {
      "id": 149,
      "title": "The Food Was Amazing",
      "topic": "Restaurant Phrases: ごちそうさま、おいしかった",
      "context": "Expressing gratitude and satisfaction after meals during journey",
      "type": "TEACH"
    },
    {
      "id": 150,
      "title": "Culinary Journey Challenge",
      "topic": "Review: Food Ordering and Dining",
      "context": "Team challenge to order and review meals at five different restaurants",
      "type": "EXAM"
    },
    {
      "id": 151,
      "title": "The Beast Has Sharp Claws",
      "topic": "Describing Creatures: Physical Features",
      "context": "Reporting on dangerous creature encountered in the forest",
      "type": "TEACH"
    },
    {
      "id": 152,
      "title": "It Moves Very Fast",
      "topic": "Describing Creatures: Abilities and Movement",
      "context": "Briefing team on enemy summon animal's capabilities",
      "type": "TEACH"
    },
    {
      "id": 153,
      "title": "A Monster Appeared Suddenly",
      "topic": "Describing Encounters: きゅうに、とつぜん",
      "context": "Emergency report during mission about unexpected creature attack",
      "type": "TEACH"
    },
    {
      "id": 154,
      "title": "We Barely Escaped",
      "topic": "Describing Difficulty: やっと、なんとか、ぎりぎり",
      "context": "Recounting close call with dangerous enemy to medical ninja",
      "type": "TEACH"
    },
    {
      "id": 155,
      "title": "Bingo Book Entry",
      "topic": "Review: Describing Threats",
      "context": "Creating detailed threat assessment of new dangerous entity",
      "type": "EXAM"
    },
    {
      "id": 156,
      "title": "I Can Use Fire Jutsu",
      "topic": "Potential Form: [verb]られる/[verb]できる",
      "context": "Discussing team capabilities before choosing mission strategy",
      "type": "TEACH"
    },
    {
      "id": 157,
      "title": "I Couldn't See the Enemy",
      "topic": "Potential Negative: [verb]られない/[verb]できない",
      "context": "Explaining difficulties faced during night stealth mission",
      "type": "TEACH"
    },
    {
      "id": 158,
      "title": "Now I Can Read Faster",
      "topic": "Potential Past: [verb]られた/[verb]できた",
      "context": "Progress report showing improvement in decoding enemy messages",
      "type": "TEACH"
    },
    {
      "id": 159,
      "title": "Have You Ever Seen This?",
      "topic": "Potential Questions: [verb]られますか",
      "context": "Asking teammates about their experience with rare techniques",
      "type": "TEACH"
    },
    {
      "id": 160,
      "title": "Skills Assessment Trial",
      "topic": "Review: Potential Form All Uses",
      "context": "Formal evaluation of team's capabilities for promotion consideration",
      "type": "EXAM"
    },
    {
      "id": 161,
      "title": "Because of the Rain",
      "topic": "Reason with Noun: [noun]のせいで、[noun]のおかげで",
      "context": "Explaining mission delays and successes due to weather conditions",
      "type": "TEACH"
    },
    {
      "id": 162,
      "title": "Even Though It's Dangerous",
      "topic": "Contradiction: [verb]ても、[verb]のに",
      "context": "Discussing why mission must continue despite risks",
      "type": "TEACH"
    },
    {
      "id": 163,
      "title": "While Traveling We Trained",
      "topic": "Simultaneous Actions: [verb]ながら",
      "context": "Explaining how team maximized training during long journey",
      "type": "TEACH"
    },
    {
      "id": 164,
      "title": "It Seems Like Rain",
      "topic": "Appearance: [verb]そうです (looks like)",
      "context": "Weather prediction during outdoor mission planning",
      "type": "TEACH"
    },
    {
      "id": 165,
      "title": "Situation Report Analysis",
      "topic": "Review: Complex Connectors",
      "context": "Comprehensive report using advanced grammar to explain mission status",
      "type": "EXAM"
    },
    {
      "id": 166,
      "title": "I Heard There's Trouble",
      "topic": "Hearsay: [plain form]そうです (I heard)",
      "context": "Gathering intelligence from travelers about situation ahead",
      "type": "TEACH"
    },
    {
      "id": 167,
      "title": "They Say He's Strong",
      "topic": "Reported Speech: [plain form]と言っていました",
      "context": "Sharing rumors and information about legendary ninja in the area",
      "type": "TEACH"
    },
    {
      "id": 168,
      "title": "According to the Map",
      "topic": "Information Source: [noun]によると",
      "context": "Planning route based on various sources of information",
      "type": "TEACH"
    },
    {
      "id": 169,
      "title": "I Think We Should Rest",
      "topic": "Opinion: [plain form]と思います",
      "context": "Team discussion about strategy and next steps in mission",
      "type": "TEACH"
    },
    {
      "id": 170,
      "title": "Intelligence Gathering Mission",
      "topic": "Review: Reporting Information",
      "context": "Compiling intelligence from multiple sources about enemy movements",
      "type": "EXAM"
    },
    {
      "id": 171,
      "title": "I'll Try Using This Jutsu",
      "topic": "Attempt: [verb]てみる",
      "context": "Experimenting with new techniques during training session",
      "type": "TEACH"
    },
    {
      "id": 172,
      "title": "Keep Going Forward",
      "topic": "Continuation: [verb]ていく",
      "context": "Encouraging team to maintain pace during long-distance travel",
      "type": "TEACH"
    },
    {
      "id": 173,
      "title": "I've Finished Preparing",
      "topic": "Completion: [verb]てしまう/[verb]ておく",
      "context": "Confirming all preparations are complete before mission start",
      "type": "TEACH"
    },
    {
      "id": 174,
      "title": "Please Wait a Moment",
      "topic": "Requesting Wait: [verb]てください、ちょっとまって",
      "context": "Coordinating timing during team maneuvers in combat",
      "type": "TEACH"
    },
    {
      "id": 175,
      "title": "Coordination Exercise",
      "topic": "Review: Te-form Compound Verbs",
      "context": "Complex team exercise requiring precise timing and communication",
      "type": "EXAM"
    },
    {
      "id": 176,
      "title": "Compared to Last Time",
      "topic": "Comparison: [noun]より、[noun]のほうが",
      "context": "Evaluating improvement in skills since beginning of journey",
      "type": "TEACH"
    },
    {
      "id": 177,
      "title": "The Most Dangerous Mission",
      "topic": "Superlative: いちばん[adjective]",
      "context": "Discussing most memorable and challenging experiences so far",
      "type": "TEACH"
    },
    {
      "id": 178,
      "title": "As Strong As Rock Lee",
      "topic": "Equality: [noun]と同じぐらい",
      "context": "Comparing abilities with other notable ninja from different teams",
      "type": "TEACH"
    },
    {
      "id": 179,
      "title": "The Better Option",
      "topic": "Preference: [A]より[B]のほうがいい",
      "context": "Debating best strategy among multiple mission approach options",
      "type": "TEACH"
    },
    {
      "id": 180,
      "title": "Strategic Planning Session",
      "topic": "Review: Comparisons and Preferences",
      "context": "Team meeting to compare options and choose best mission approach",
      "type": "EXAM"
    },
    {
      "id": 181,
      "title": "Before the Battle Starts",
      "topic": "Before/After: [verb]まえに、[verb]あとで",
      "context": "Preparing strategy and discussing post-battle procedures",
      "type": "TEACH"
    },
    {
      "id": 182,
      "title": "During the Journey",
      "topic": "Duration: [verb]ている間に、[noun]の間",
      "context": "Discussing events that occurred while traveling between villages",
      "type": "TEACH"
    },
    {
      "id": 183,
      "title": "Until We Reach the Village",
      "topic": "Until: [verb]まで、[verb]までに",
      "context": "Setting goals and deadlines for mission completion",
      "type": "TEACH"
    },
    {
      "id": 184,
      "title": "Since Leaving Konoha",
      "topic": "Since/From: [time]から、[time]以来",
      "context": "Reflecting on everything that happened since journey began",
      "type": "TEACH"
    },
    {
      "id": 185,
      "title": "Mission Timeline Report",
      "topic": "Review: Time Expressions",
      "context": "Creating detailed timeline of mission events for official records",
      "type": "EXAM"
    },
    {
      "id": 186,
      "title": "I Want You to Help",
      "topic": "Desire for Others: [verb]てほしい",
      "context": "Requesting specific assistance from teammates for complex task",
      "type": "TEACH"
    },
    {
      "id": 187,
      "title": "It's Easy to Use",
      "topic": "Ease/Difficulty: [verb]やすい、[verb]にくい",
      "context": "Evaluating new ninja tools and equipment during trial period",
      "type": "TEACH"
    },
    {
      "id": 188,
      "title": "Too Much Chakra",
      "topic": "Excessive: [verb]すぎる",
      "context": "Medical evaluation after overusing techniques during training",
      "type": "TEACH"
    },
    {
      "id": 189,
      "title": "It Started to Rain",
      "topic": "Change of State: [verb]出す、[verb]始める",
      "context": "Describing sudden weather change during outdoor mission",
      "type": "TEACH"
    },
    {
      "id": 190,
      "title": "Equipment Evaluation Report",
      "topic": "Review: Descriptive Verb Forms",
      "context": "Comprehensive review of new equipment after field testing",
      "type": "EXAM"
    },
    {
      "id": 191,
      "title": "Making Camp Properly",
      "topic": "Manner: [verb]方、[verb]かた",
      "context": "Learning proper techniques for wilderness survival from sensei",
      "type": "TEACH"
    },
    {
      "id": 192,
      "title": "It's Difficult to Explain",
      "topic": "Nominalizing: [verb]のは/のが",
      "context": "Discussing complex jutsu theory that's hard to put into words",
      "type": "TEACH"
    },
    {
      "id": 193,
      "title": "In Order to Get Stronger",
      "topic": "Purpose: [verb]ために、[noun]のために",
      "context": "Explaining motivation behind intensive training regimen",
      "type": "TEACH"
    },
    {
      "id": 194,
      "title": "Even the Sensei Couldn't",
      "topic": "Emphasis: [noun]でも、[verb]てもかまわない",
      "context": "Describing truly exceptional difficulty of legendary jutsu",
      "type": "TEACH"
    },
    {
      "id": 195,
      "title": "Advanced Grammar Assessment",
      "topic": "Review: Complex Structures",
      "context": "Written examination testing comprehension of advanced patterns",
      "type": "EXAM"
    },
    {
      "id": 196,
      "title": "Tales from the Road",
      "topic": "Narrative Past: Storytelling Practice",
      "context": "Sharing adventure stories with other travelers at an inn",
      "type": "TEACH"
    },
    {
      "id": 197,
      "title": "Letter to the Hokage",
      "topic": "Formal Writing: Mission Progress Report",
      "context": "Writing official correspondence about mission status from abroad",
      "type": "TEACH"
    },
    {
      "id": 198,
      "title": "Understanding Local Dialects",
      "topic": "Regional Variations: Common dialectical differences",
      "context": "Communicating with locals who speak with strong regional accents",
      "type": "TEACH"
    },
    {
      "id": 199,
      "title": "Emergency Communication",
      "topic": "Crisis Language: Urgent warnings and requests",
      "context": "Simulated emergency requiring clear rapid communication under pressure",
      "type": "TEACH"
    },
    {
      "id": 200,
      "title": "The Chunin Trials: Final Examination",
      "topic": "Comprehensive Review: All Chunin Arc Skills",
      "context": "Final comprehensive exam covering all intermediate skills before advancing",
      "type": "EXAM"
    },

    {
      "id": 201,
      "title": "Can You Master This Technique?",
      "topic": "Potential Form Introduction: [verb]られる/[verb]える",
      "context": "Sensei asking if you can learn the signature technique before tournament",
      "type": "TEACH"
    },
    {
      "id": 202,
      "title": "I Can Win This Match",
      "topic": "Potential Form: Positive statements",
      "context": "Pre-tournament declaration of abilities to boost team morale",
      "type": "TEACH"
    },
    {
      "id": 203,
      "title": "My Rival Can't Be Defeated Easily",
      "topic": "Potential Form: Negative statements",
      "context": "Analyzing rival's strengths and weaknesses before tournament match",
      "type": "TEACH"
    },
    {
      "id": 204,
      "title": "Could You See That Move?",
      "topic": "Potential Form: Questions and past tense",
      "context": "Debriefing after watching high-speed combat between elite fighters",
      "type": "TEACH"
    },
    {
      "id": 205,
      "title": "Pre-Tournament Assessment",
      "topic": "Review: Potential Form All Uses",
      "context": "Official evaluation of all competitors' abilities before tournament begins",
      "type": "EXAM"
    },
    {
      "id": 206,
      "title": "Let's Train Together!",
      "topic": "Volitional Form Introduction: [verb]よう/[verb]ましょう",
      "context": "Inviting training partners for intensive pre-tournament preparation",
      "type": "TEACH"
    },
    {
      "id": 207,
      "title": "I'll Become Stronger",
      "topic": "Volitional Form: Personal determination",
      "context": "Internal monologue during grueling training montage sequences",
      "type": "TEACH"
    },
    {
      "id": 208,
      "title": "Let's Decide on Strategy",
      "topic": "Volitional Form: Group decisions",
      "context": "Team meeting to plan tournament tactics and backup plans",
      "type": "TEACH"
    },
    {
      "id": 209,
      "title": "I Think I'll Try That",
      "topic": "Volitional Form: Thinking/Intending [verb]ようとおもう",
      "context": "Discussing potential techniques to use in upcoming match",
      "type": "TEACH"
    },
    {
      "id": 210,
      "title": "Team Strategy Session",
      "topic": "Review: Volitional Form All Uses",
      "context": "Final planning meeting before tournament matches begin",
      "type": "EXAM"
    },
    {
      "id": 211,
      "title": "Stronger Than Before",
      "topic": "Comparison Basics: [A]より[B]のほうが",
      "context": "Comparing current abilities with skill level from genin days",
      "type": "TEACH"
    },
    {
      "id": 212,
      "title": "Who Is the Fastest?",
      "topic": "Comparisons: Questions with どちら/どっち",
      "context": "Analyzing speed statistics of tournament competitors",
      "type": "TEACH"
    },
    {
      "id": 213,
      "title": "The Strongest Fighter",
      "topic": "Superlatives: いちばん[adjective]",
      "context": "Discussing favorites and predictions for tournament champion",
      "type": "TEACH"
    },
    {
      "id": 214,
      "title": "As Powerful as the Legend",
      "topic": "Equality Comparisons: [A]と同じくらい",
      "context": "Comparing your rival's strength to legendary past champions",
      "type": "TEACH"
    },
    {
      "id": 215,
      "title": "Fighter Analysis Report",
      "topic": "Review: All Comparison Forms",
      "context": "Creating detailed comparative analysis of all tournament participants",
      "type": "EXAM"
    },
    {
      "id": 216,
      "title": "If I Win This Match",
      "topic": "Conditional: たら form introduction",
      "context": "Discussing what happens if you advance to next tournament round",
      "type": "TEACH"
    },
    {
      "id": 217,
      "title": "When the Bell Rings",
      "topic": "Temporal Conditional: [verb]たら (when)",
      "context": "Explaining tournament rules and what happens at each signal",
      "type": "TEACH"
    },
    {
      "id": 218,
      "title": "If It's Rainy Tomorrow",
      "topic": "Conditional: Past form in both clauses",
      "context": "Planning for weather contingencies for outdoor tournament matches",
      "type": "TEACH"
    },
    {
      "id": 219,
      "title": "What Would You Do If...?",
      "topic": "Hypothetical Conditionals with たら",
      "context": "Strategy session discussing various what-if scenarios in matches",
      "type": "TEACH"
    },
    {
      "id": 220,
      "title": "Tournament Scenario Planning",
      "topic": "Review: Tara Conditionals",
      "context": "Preparing responses for every possible match-up scenario",
      "type": "EXAM"
    },
    {
      "id": 221,
      "title": "If You Press This Point",
      "topic": "Conditional: ば form introduction",
      "context": "Medical ninja explaining pressure points and their effects in combat",
      "type": "TEACH"
    },
    {
      "id": 222,
      "title": "If You Train Hard",
      "topic": "Ba form: Cause and effect",
      "context": "Motivational speech from sensei about effort and results",
      "type": "TEACH"
    },
    {
      "id": 223,
      "title": "The More You Practice",
      "topic": "Ba form: [verb]ば[verb]ほど (the more... the more)",
      "context": "Discussing exponential improvement through dedicated training",
      "type": "TEACH"
    },
    {
      "id": 224,
      "title": "If Only I Were Stronger",
      "topic": "Ba form: Regret and wishes",
      "context": "Emotional flashback after losing important preliminary match",
      "type": "TEACH"
    },
    {
      "id": 225,
      "title": "Cause and Effect Analysis",
      "topic": "Review: Ba Conditionals",
      "context": "Analyzing what factors lead to victory in tournament matches",
      "type": "EXAM"
    },
    {
      "id": 226,
      "title": "When You Use This Jutsu",
      "topic": "Conditional: と form (natural consequence)",
      "context": "Technical explanation of jutsu effects and guaranteed outcomes",
      "type": "TEACH"
    },
    {
      "id": 227,
      "title": "When I Fight Him",
      "topic": "To form: Habitual/general truth",
      "context": "Describing typical patterns in your rival's fighting style",
      "type": "TEACH"
    },
    {
      "id": 228,
      "title": "Whenever I Remember",
      "topic": "To form: Repeated actions",
      "context": "Flashback trigger - whenever you see certain moves, you remember past",
      "type": "TEACH"
    },
    {
      "id": 229,
      "title": "Press Here and It Activates",
      "topic": "To form: Instructions and mechanisms",
      "context": "Learning how special tournament arena features and traps work",
      "type": "TEACH"
    },
    {
      "id": 230,
      "title": "Conditional Mastery Test",
      "topic": "Review: Comparing たら/ば/と conditionals",
      "context": "Advanced strategy test requiring perfect conditional usage",
      "type": "EXAM"
    },
    {
      "id": 231,
      "title": "My Master Gave Me This",
      "topic": "Giving: あげます introduction",
      "context": "Receiving special equipment from sensei before tournament",
      "type": "TEACH"
    },
    {
      "id": 232,
      "title": "I'll Give You This Tip",
      "topic": "Giving: [person]に[thing]をあげます",
      "context": "Senior ninja sharing secret techniques with tournament participants",
      "type": "TEACH"
    },
    {
      "id": 233,
      "title": "I Gave My Best Effort",
      "topic": "Giving: Abstract concepts",
      "context": "Post-match reflection on giving your all during intense battle",
      "type": "TEACH"
    },
    {
      "id": 234,
      "title": "Presenting to the Champion",
      "topic": "Giving Up: さしあげます (humble)",
      "context": "Prize presentation ceremony with formal honorific language",
      "type": "TEACH"
    },
    {
      "id": 235,
      "title": "Gift Exchange Ceremony",
      "topic": "Review: Giving Verbs",
      "context": "Pre-tournament ritual where competitors exchange good luck charms",
      "type": "EXAM"
    },
    {
      "id": 236,
      "title": "Sensei Gave Me Advice",
      "topic": "Receiving: くれます introduction",
      "context": "Grateful for mentor's guidance before important match",
      "type": "TEACH"
    },
    {
      "id": 237,
      "title": "Everyone Supported Me",
      "topic": "Receiving: [person]が[thing]をくれました",
      "context": "Emotional reflection on all the support received during tournament",
      "type": "TEACH"
    },
    {
      "id": 238,
      "title": "My Rival Taught Me",
      "topic": "Receiving Actions: [verb]てくれます",
      "context": "Flashback to when rival shared training secrets before becoming enemies",
      "type": "TEACH"
    },
    {
      "id": 239,
      "title": "Thanks for Helping Me",
      "topic": "Receiving: [verb]てくれてありがとう",
      "context": "Expressing gratitude to training partners after intensive preparation",
      "type": "TEACH"
    },
    {
      "id": 240,
      "title": "Gratitude Expression Test",
      "topic": "Review: Receiving Verbs",
      "context": "Creating thank you speech for all supporters before finals",
      "type": "EXAM"
    },
    {
      "id": 241,
      "title": "I Received From the Master",
      "topic": "Receiving Humble: いただきます",
      "context": "Formal receiving of sacred technique scroll from legendary ninja",
      "type": "TEACH"
    },
    {
      "id": 242,
      "title": "They Did This For Me",
      "topic": "Benefactive: [verb]てもらいます",
      "context": "Acknowledging all those who helped in tournament preparation",
      "type": "TEACH"
    },
    {
      "id": 243,
      "title": "I Had Him Teach Me",
      "topic": "Causative Receiving: [verb]てもらう",
      "context": "Requesting special training from reluctant master before finals",
      "type": "TEACH"
    },
    {
      "id": 244,
      "title": "Would You Help Me?",
      "topic": "Requesting Help: [verb]てもらえませんか",
      "context": "Politely asking teammate to practice specific combination moves",
      "type": "TEACH"
    },
    {
      "id": 245,
      "title": "Giving and Receiving Comprehensive",
      "topic": "Review: All giving/receiving verbs",
      "context": "Describing complete support network that led to tournament success",
      "type": "EXAM"
    },
    {
      "id": 246,
      "title": "I Must Win This",
      "topic": "Obligation Strong: [verb]なければならない",
      "context": "Internal pressure and responsibility before crucial match",
      "type": "TEACH"
    },
    {
      "id": 247,
      "title": "You Don't Have to Fight",
      "topic": "Lack of Obligation: [verb]なくてもいい",
      "context": "Sensei giving permission to forfeit if injury is too severe",
      "type": "TEACH"
    },
    {
      "id": 248,
      "title": "I Should Have Trained More",
      "topic": "Regret: [verb]ばよかった",
      "context": "Post-loss reflection on what could have been done differently",
      "type": "TEACH"
    },
    {
      "id": 249,
      "title": "You Shouldn't Push Yourself",
      "topic": "Negative Advice: [verb]ないほうがいい",
      "context": "Medical ninja warning about continuing with serious injury",
      "type": "TEACH"
    },
    {
      "id": 250,
      "title": "Decision Making Under Pressure",
      "topic": "Review: Obligation and Advice",
      "context": "Critical decision point in match requiring judgment about risks",
      "type": "EXAM"
    },
    {
      "id": 251,
      "title": "According to the Rules",
      "topic": "Hearsay and Quotation: そうです/といいます",
      "context": "Discussing tournament regulations and what referees said",
      "type": "TEACH"
    },
    {
      "id": 252,
      "title": "I Heard He's Unbeatable",
      "topic": "Reported Information: [plain]そうです",
      "context": "Gathering intelligence on mysterious tournament favorite",
      "type": "TEACH"
    },
    {
      "id": 253,
      "title": "It Looks Like Rain",
      "topic": "Appearance: [masu stem]そうです",
      "context": "Predicting weather conditions for outdoor tournament finals",
      "type": "TEACH"
    },
    {
      "id": 254,
      "title": "The Champion Said That",
      "topic": "Direct Quotation: と言いました",
      "context": "Recalling exact words from previous champion's inspiring speech",
      "type": "TEACH"
    },
    {
      "id": 255,
      "title": "Intelligence Gathering Mission",
      "topic": "Review: Reporting and Hearsay",
      "context": "Compiling all rumors and facts about upcoming opponents",
      "type": "EXAM"
    },
    {
      "id": 256,
      "title": "While Watching the Match",
      "topic": "Simultaneous Action: [verb]ながら",
      "context": "Analyzing opponent's techniques while observing their fight",
      "type": "TEACH"
    },
    {
      "id": 257,
      "title": "Despite Being Injured",
      "topic": "Concession: [verb]のに",
      "context": "Rival continues fighting impressively despite serious wounds",
      "type": "TEACH"
    },
    {
      "id": 258,
      "title": "Even If I Lose",
      "topic": "Concessive Conditional: [verb]ても",
      "context": "Determination to give best performance regardless of outcome",
      "type": "TEACH"
    },
    {
      "id": 259,
      "title": "No Matter How Strong",
      "topic": "Concession with Question Words: どんなに[adj]ても",
      "context": "Refusing to give up against overwhelming opponent strength",
      "type": "TEACH"
    },
    {
      "id": 260,
      "title": "Fighting Spirit Analysis",
      "topic": "Review: Complex Concessive Forms",
      "context": "Psychological evaluation of competitors' mental fortitude",
      "type": "EXAM"
    },
    {
      "id": 261,
      "title": "In Order to Win",
      "topic": "Purpose: [verb]ために",
      "context": "Explaining ultimate goals behind intensive training regimen",
      "type": "TEACH"
    },
    {
      "id": 262,
      "title": "For My Team's Sake",
      "topic": "Purpose with Nouns: [noun]のために",
      "context": "Fighting for something bigger than personal glory",
      "type": "TEACH"
    },
    {
      "id": 263,
      "title": "Training to Get Stronger",
      "topic": "Purpose: [verb]ように",
      "context": "Setting specific training goals before tournament begins",
      "type": "TEACH"
    },
    {
      "id": 264,
      "title": "So That Everyone Can See",
      "topic": "Purpose for Others: [verb]ように",
      "context": "Wanting to demonstrate techniques to inspire younger fighters",
      "type": "TEACH"
    },
    {
      "id": 265,
      "title": "Motivation Declaration",
      "topic": "Review: Purpose Expressions",
      "context": "Pre-finals speech explaining reasons for fighting in tournament",
      "type": "EXAM"
    },
    {
      "id": 266,
      "title": "It's Easy to Counter",
      "topic": "Ease/Difficulty: [verb]やすい/にくい",
      "context": "Analyzing which opponent techniques are easiest to defend against",
      "type": "TEACH"
    },
    {
      "id": 267,
      "title": "Too Fast to See",
      "topic": "Excessive: [verb]すぎる",
      "context": "Describing attacks that are impossibly fast to react to",
      "type": "TEACH"
    },
    {
      "id": 268,
      "title": "About to Begin",
      "topic": "Imminence: [verb]そうです/[verb]ところです",
      "context": "Moments before tournament finals match begins",
      "type": "TEACH"
    },
    {
      "id": 269,
      "title": "Continuing to Fight",
      "topic": "Progressive: [verb]続ける/[verb]ている",
      "context": "Describing prolonged intense battle that won't end",
      "type": "TEACH"
    },
    {
      "id": 270,
      "title": "Combat Analysis Report",
      "topic": "Review: Descriptive Verb Forms",
      "context": "Detailed technical analysis of fighting styles observed in tournament",
      "type": "EXAM"
    },
    {
      "id": 271,
      "title": "The Way to Victory",
      "topic": "Method: [verb]方/[verb]かた",
      "context": "Learning proper tournament strategy from experienced fighters",
      "type": "TEACH"
    },
    {
      "id": 272,
      "title": "Winning Is Everything",
      "topic": "Nominalization: [verb]のは/[verb]のが",
      "context": "Philosophical discussion about what truly matters in competition",
      "type": "TEACH"
    },
    {
      "id": 273,
      "title": "It's Time to Fight",
      "topic": "Time Expressions: [verb]時/[verb]時間",
      "context": "Announcing when each match will take place in tournament schedule",
      "type": "TEACH"
    },
    {
      "id": 274,
      "title": "Whether to Attack or Defend",
      "topic": "Alternative Questions: [verb]か[verb]か",
      "context": "Split-second decision making during intense tournament battle",
      "type": "TEACH"
    },
    {
      "id": 275,
      "title": "Advanced Strategy Test",
      "topic": "Review: Complex Nominal Forms",
      "context": "Theoretical exam on decision-making in various combat scenarios",
      "type": "EXAM"
    },
    {
      "id": 276,
      "title": "Having Won Before",
      "topic": "Experience: [verb]たことがある",
      "context": "Discussing previous tournament experience and what was learned",
      "type": "TEACH"
    },
    {
      "id": 277,
      "title": "Just Finished Training",
      "topic": "Completion: [verb]たばかり",
      "context": "Arriving at match right after completing intense preparation session",
      "type": "TEACH"
    },
    {
      "id": 278,
      "title": "Have Already Decided",
      "topic": "Prior Completion: もう[verb]てしまった",
      "context": "Revealing that strategy was decided before match even started",
      "type": "TEACH"
    },
    {
      "id": 279,
      "title": "Haven't Fought Yet",
      "topic": "Not Yet: まだ[verb]ていない",
      "context": "Discussing remaining matches and opponents not yet faced",
      "type": "TEACH"
    },
    {
      "id": 280,
      "title": "Tournament Progress Report",
      "topic": "Review: Completion and Experience",
      "context": "Mid-tournament assessment of what has and hasn't happened yet",
      "type": "EXAM"
    },
    {
      "id": 281,
      "title": "Trying My Hardest",
      "topic": "Attempt: [verb]てみる",
      "context": "Testing out new technique for first time in actual match",
      "type": "TEACH"
    },
    {
      "id": 282,
      "title": "Prepared in Advance",
      "topic": "Preparation: [verb]ておく",
      "context": "Revealing all the preparations made before tournament started",
      "type": "TEACH"
    },
    {
      "id": 283,
      "title": "Completely Finished",
      "topic": "Regrettable Completion: [verb]てしまう",
      "context": "Match ended too quickly, finishing move was too powerful",
      "type": "TEACH"
    },
    {
      "id": 284,
      "title": "Keep on Fighting",
      "topic": "Continuation: [verb]ていく/[verb]てくる",
      "context": "Encouraging words to continue battle despite exhaustion",
      "type": "TEACH"
    },
    {
      "id": 285,
      "title": "Compound Verb Mastery",
      "topic": "Review: Te-form Compounds",
      "context": "Complex combination techniques requiring all compound forms",
      "type": "EXAM"
    },
    {
      "id": 286,
      "title": "Making Him Surrender",
      "topic": "Causative: [verb]させる",
      "context": "Psychological warfare to make opponent give up without fighting",
      "type": "TEACH"
    },
    {
      "id": 287,
      "title": "Being Forced to Retreat",
      "topic": "Causative Passive: [verb]させられる",
      "context": "Describing how opponent's strategy forced defensive position",
      "type": "TEACH"
    },
    {
      "id": 288,
      "title": "Allowing Him to Attack",
      "topic": "Causative Permission: [verb]させてあげる",
      "context": "Deliberately creating opening to bait opponent into trap",
      "type": "TEACH"
    },
    {
      "id": 289,
      "title": "Let Me Fight!",
      "topic": "Causative Request: [verb]させてください",
      "context": "Begging sensei to allow participation despite injury concerns",
      "type": "TEACH"
    },
    {
      "id": 290,
      "title": "Causative Strategy Session",
      "topic": "Review: All Causative Forms",
      "context": "Planning how to manipulate opponent's actions during match",
      "type": "EXAM"
    },
    {
      "id": 291,
      "title": "My Childhood Memories",
      "topic": "Emotional Flashback: Past narrative",
      "context": "Flashback to training days with rival before tournament began",
      "type": "TEACH"
    },
    {
      "id": 292,
      "title": "The Promise We Made",
      "topic": "Flashback Dialogue: Past promises",
      "context": "Remembering vow to meet rival in tournament finals someday",
      "type": "TEACH"
    },
    {
      "id": 293,
      "title": "Because of That Day",
      "topic": "Flashback Motivation: Past reasons",
      "context": "Explaining how past trauma drives current tournament performance",
      "type": "TEACH"
    },
    {
      "id": 294,
      "title": "Master's Final Words",
      "topic": "Flashback Wisdom: Remembered advice",
      "context": "Crucial moment where master's past teachings provide solution",
      "type": "TEACH"
    },
    {
      "id": 295,
      "title": "Emotional Narrative Test",
      "topic": "Review: Storytelling and Flashbacks",
      "context": "Creating complete backstory narrative explaining tournament motivation",
      "type": "EXAM"
    },
    {
      "id": 296,
      "title": "Beyond My Limits",
      "topic": "Expressing Limits: [verb]きれない/[verb]すぎる",
      "context": "Pushing past perceived limitations during desperate final moments",
      "type": "TEACH"
    },
    {
      "id": 297,
      "title": "No Matter What Happens",
      "topic": "Determination: どんなことがあっても",
      "context": "Absolute resolve to continue fighting regardless of circumstances",
      "type": "TEACH"
    },
    {
      "id": 298,
      "title": "This Is My Ninja Way",
      "topic": "Personal Philosophy: Core beliefs expression",
      "context": "Naruto-style declaration of personal code during climactic moment",
      "type": "TEACH"
    },
    {
      "id": 299,
      "title": "Victory Speech",
      "topic": "Advanced Expression: Gratitude and growth",
      "context": "Winner's speech thanking everyone and reflecting on journey",
      "type": "TEACH"
    },
    {
      "id": 300,
      "title": "The Tournament Finals: Ultimate Test",
      "topic": "Comprehensive Review: All Tournament Arc Skills",
      "context": "Final comprehensive examination covering all intermediate concepts",
      "type": "EXAM"
  },

    {
      "id": 301,
      "title": "The Village Was Attacked",
      "topic": "Passive Voice Introduction: [verb]られる",
      "context": "Emergency briefing describing enemy assault on the village",
      "type": "TEACH"
    },
    {
      "id": 302,
      "title": "I Was Chosen for the Mission",
      "topic": "Passive Voice: Selection and assignment",
      "context": "Being selected for elite special operations unit during war",
      "type": "TEACH"
    },
    {
      "id": 303,
      "title": "We Were Betrayed",
      "topic": "Passive Voice: Negative experiences",
      "context": "Discovering that trusted ally was actually enemy spy",
      "type": "TEACH"
    },
    {
      "id": 304,
      "title": "The Secret Was Discovered",
      "topic": "Passive Voice: Intransitive verbs",
      "context": "Intel leak revealing classified war strategies to enemy",
      "type": "TEACH"
    },
    {
      "id": 305,
      "title": "War Council Briefing",
      "topic": "Review: Passive Voice All Forms",
      "context": "Formal military report using passive voice for war incidents",
      "type": "EXAM"
    },
    {
      "id": 306,
      "title": "I Was Made to Infiltrate",
      "topic": "Causative-Passive: [verb]させられる",
      "context": "Unwillingly assigned dangerous undercover mission behind enemy lines",
      "type": "TEACH"
    },
    {
      "id": 307,
      "title": "Forced to Choose Sides",
      "topic": "Causative-Passive: Difficult decisions",
      "context": "Spy caught between loyalty to village and personal relationships",
      "type": "TEACH"
    },
    {
      "id": 308,
      "title": "They Made Us Wait",
      "topic": "Causative-Passive: Indirect suffering",
      "context": "Frustration at being held back from battle by command decisions",
      "type": "TEACH"
    },
    {
      "id": 309,
      "title": "I Couldn't Help But Fight",
      "topic": "Causative-Passive: Compulsion",
      "context": "Unable to resist joining battle despite orders to stand down",
      "type": "TEACH"
    },
    {
      "id": 310,
      "title": "Psychological Operations Report",
      "topic": "Review: Causative-Passive Forms",
      "context": "Analyzing how enemies manipulate allies into taking actions",
      "type": "EXAM"
    },
    {
      "id": 311,
      "title": "Reporting to the Hokage",
      "topic": "Keigo Introduction: です/ます basics",
      "context": "First formal mission report to village leader using polite language",
      "type": "TEACH"
    },
    {
      "id": 312,
      "title": "The Hokage Said",
      "topic": "Respectful: おっしゃる (said)",
      "context": "Conveying the Hokage's orders with proper respectful language",
      "type": "TEACH"
    },
    {
      "id": 313,
      "title": "The Hokage Is Present",
      "topic": "Respectful: いらっしゃる (is/comes/goes)",
      "context": "Announcing the Hokage's arrival at war council meeting",
      "type": "TEACH"
    },
    {
      "id": 314,
      "title": "What Did the Hokage Do?",
      "topic": "Respectful: なさる (do)",
      "context": "Inquiring about leader's actions during critical battle",
      "type": "TEACH"
    },
    {
      "id": 315,
      "title": "Formal Military Protocol",
      "topic": "Review: Basic Respectful Language",
      "context": "Official ceremony requiring perfect respectful language throughout",
      "type": "EXAM"
    },
    {
      "id": 316,
      "title": "I Humbly Report",
      "topic": "Humble: 申す/申し上げる (say)",
      "context": "Delivering intelligence report to council of village elders",
      "type": "TEACH"
    },
    {
      "id": 317,
      "title": "I Will Go Investigate",
      "topic": "Humble: 参る (go/come)",
      "context": "Volunteering for reconnaissance mission in humble formal speech",
      "type": "TEACH"
    },
    {
      "id": 318,
      "title": "Allow Me to Show You",
      "topic": "Humble: お見せする (show)",
      "context": "Presenting classified documents to superior officers",
      "type": "TEACH"
    },
    {
      "id": 319,
      "title": "I Humbly Ask",
      "topic": "Humble: 伺う (ask/visit)",
      "context": "Requesting audience with Hokage for urgent war matters",
      "type": "TEACH"
    },
    {
      "id": 320,
      "title": "Diplomatic Mission",
      "topic": "Review: Basic Humble Language",
      "context": "Peace negotiation requiring perfect humble language with enemy leader",
      "type": "EXAM"
    },
    {
      "id": 321,
      "title": "Please Await Orders",
      "topic": "Respectful Requests: お[verb]ください",
      "context": "Commander giving polite but firm orders to subordinate units",
      "type": "TEACH"
    },
    {
      "id": 322,
      "title": "Would You Please Consider",
      "topic": "Humble Requests: お[verb]いたします",
      "context": "Formally proposing alternative strategy to military leadership",
      "type": "TEACH"
    },
    {
      "id": 323,
      "title": "If You Would Be So Kind",
      "topic": "Maximum Politeness: [verb]ていただけますか",
      "context": "Asking legendary warrior for assistance in desperate situation",
      "type": "TEACH"
    },
    {
      "id": 324,
      "title": "I Shall Undertake This",
      "topic": "Formal Acceptance: 承る/仰せつかる",
      "context": "Formally accepting critical mission assignment from Hokage",
      "type": "TEACH"
    },
    {
      "id": 325,
      "title": "Formal Request Protocol",
      "topic": "Review: Keigo Request Forms",
      "context": "High-stakes negotiation requiring multiple levels of politeness",
      "type": "EXAM"
    },
    {
      "id": 326,
      "title": "The Enemy Knows Our Position",
      "topic": "Transitive vs Intransitive: 知る/知られる",
      "context": "Realizing that classified information has been compromised",
      "type": "TEACH"
    },
    {
      "id": 327,
      "title": "The Door Opened Suddenly",
      "topic": "Intransitive: あく/開く (open)",
      "context": "Surprise enemy infiltration during war council meeting",
      "type": "TEACH"
    },
    {
      "id": 328,
      "title": "I Opened the Scroll",
      "topic": "Transitive: あける/開ける (open)",
      "context": "Unsealing secret orders from Hokage during mission",
      "type": "TEACH"
    },
    {
      "id": 329,
      "title": "The Fire Went Out",
      "topic": "Intransitive: きえる/消える (go out)",
      "context": "Signal fires extinguishing during crucial communication moment",
      "type": "TEACH"
    },
    {
      "id": 330,
      "title": "Transitive Verb Mastery",
      "topic": "Review: Transitive/Intransitive Pairs",
      "context": "Precise mission report requiring correct verb choice throughout",
      "type": "EXAM"
    },
    {
      "id": 331,
      "title": "The Alliance Was Formed",
      "topic": "More Intransitives: できる/できあがる",
      "context": "Historical account of how shinobi alliance came together",
      "type": "TEACH"
    },
    {
      "id": 332,
      "title": "We Gathered the Forces",
      "topic": "More Transitives: あつめる/集める",
      "context": "Coordinating assembly of allied forces for major battle",
      "type": "TEACH"
    },
    {
      "id": 333,
      "title": "The War Began",
      "topic": "Intransitive: はじまる/始まる",
      "context": "Describing the outbreak of the Fourth Great Ninja War",
      "type": "TEACH"
    },
    {
      "id": 334,
      "title": "I Started the Operation",
      "topic": "Transitive: はじめる/始める",
      "context": "Taking initiative to commence secret infiltration mission",
      "type": "TEACH"
    },
    {
      "id": 335,
      "title": "Battle Narrative Construction",
      "topic": "Review: Advanced Transitive/Intransitive",
      "context": "Writing official war history requiring precise verb distinctions",
      "type": "EXAM"
    },
    {
      "id": 336,
      "title": "I've Made a Terrible Mistake",
      "topic": "Regret: [verb]てしまった (unintended result)",
      "context": "Realizing that actions led to ally's death during mission",
      "type": "TEACH"
    },
    {
      "id": 337,
      "title": "I've Already Decided",
      "topic": "Completion: [verb]てしまった (finality)",
      "context": "Point of no return after making irreversible tactical decision",
      "type": "TEACH"
    },
    {
      "id": 338,
      "title": "I Ended Up Betraying Them",
      "topic": "Regret: [verb]てしまう (unfortunate outcome)",
      "context": "Spy forced to sacrifice allies to maintain cover identity",
      "type": "TEACH"
    },
    {
      "id": 339,
      "title": "Everything Is Lost",
      "topic": "Regret: [verb]てしまった (irrevocable loss)",
      "context": "Moment of despair when village appears to be defeated",
      "type": "TEACH"
    },
    {
      "id": 340,
      "title": "Confession and Regret",
      "topic": "Review: Expressing Regret",
      "context": "Character confessing past mistakes to commander before final battle",
      "type": "EXAM"
    },
    {
      "id": 341,
      "title": "Fighting Back Against Fate",
      "topic": "Compound: たたかいもどる (fight back)",
      "context": "Refusing to accept defeat and launching counteroffensive",
      "type": "TEACH"
    },
    {
      "id": 342,
      "title": "Cutting Through the Enemy",
      "topic": "Compound: きりぬける (cut through/overcome)",
      "context": "Breaking through enemy encirclement to deliver message",
      "type": "TEACH"
    },
    {
      "id": 343,
      "title": "Rushing Into Battle",
      "topic": "Compound: とびこむ (jump into)",
      "context": "Impulsively joining combat to save surrounded teammate",
      "type": "TEACH"
    },
    {
      "id": 344,
      "title": "Pursuing the Enemy",
      "topic": "Compound: おいかける (chase after)",
      "context": "Following retreating enemy forces to gather intelligence",
      "type": "TEACH"
    },
    {
      "id": 345,
      "title": "Combat Report: Complex Actions",
      "topic": "Review: Compound Verbs",
      "context": "Detailed after-action report using compound verbs for precision",
      "type": "EXAM"
    },
    {
      "id": 346,
      "title": "Thinking Through Strategy",
      "topic": "Compound: かんがえぬく (think through)",
      "context": "War council deliberating over multiple strategic options",
      "type": "TEACH"
    },
    {
      "id": 347,
      "title": "Holding Out Until Reinforcements",
      "topic": "Compound: もちこたえる (hold out/endure)",
      "context": "Defending position against overwhelming odds awaiting backup",
      "type": "TEACH"
    },
    {
      "id": 348,
      "title": "Breaking Down the Defense",
      "topic": "Compound: くずれおちる (collapse/break down)",
      "context": "Watching ally defenses fail under sustained enemy assault",
      "type": "TEACH"
    },
    {
      "id": 349,
      "title": "Seeing Through the Deception",
      "topic": "Compound: みやぶる (see through)",
      "context": "Intelligence officer detecting enemy's false information campaign",
      "type": "TEACH"
    },
    {
      "id": 350,
      "title": "Advanced Tactical Language",
      "topic": "Review: Complex Compound Verbs",
      "context": "Strategic analysis requiring nuanced compound verb usage",
      "type": "EXAM"
    },
    {
      "id": 351,
      "title": "Speaking With the Enemy Leader",
      "topic": "Formal Negotiation: Keigo in conflict",
      "context": "Tense diplomatic meeting with hostile faction leader",
      "type": "TEACH"
    },
    {
      "id": 352,
      "title": "The Villain's Demands",
      "topic": "Understanding Threats: Formal hostile language",
      "context": "Decoding polite but menacing ultimatum from antagonist",
      "type": "TEACH"
    },
    {
      "id": 353,
      "title": "Respectfully Refusing",
      "topic": "Polite Rejection: お断りいたします",
      "context": "Turning down enemy's surrender offer with dignity",
      "type": "TEACH"
    },
    {
      "id": 354,
      "title": "The Final Warning",
      "topic": "Formal Declarations: 申し伝える",
      "context": "Delivering ultimatum to enemy forces before battle",
      "type": "TEACH"
    },
    {
      "id": 355,
      "title": "Diplomatic Crisis Management",
      "topic": "Review: Keigo in Hostile Contexts",
      "context": "High-stakes negotiation with multiple hostile parties present",
      "type": "EXAM"
    },
    {
      "id": 356,
      "title": "Undercover Identity",
      "topic": "Spy Mission: Code language and formality",
      "context": "Infiltrating enemy headquarters using false identity",
      "type": "TEACH"
    },
    {
      "id": 357,
      "title": "Maintaining Cover",
      "topic": "Spy Mission: Consistent speech patterns",
      "context": "Speaking like enemy soldier to avoid detection during mission",
      "type": "TEACH"
    },
    {
      "id": 358,
      "title": "The Secret Signal",
      "topic": "Spy Mission: Coded messages",
      "context": "Passing intelligence to allies through seemingly normal conversation",
      "type": "TEACH"
    },
    {
      "id": 359,
      "title": "Cover Story Under Interrogation",
      "topic": "Spy Mission: Maintaining deception under pressure",
      "context": "Being questioned by suspicious enemy counterintelligence",
      "type": "TEACH"
    },
    {
      "id": 360,
      "title": "Deep Cover Operation",
      "topic": "Review: Espionage Language Skills",
      "context": "Long-term infiltration mission requiring perfect language adaptation",
      "type": "EXAM"
    },
    {
      "id": 361,
      "title": "My Entire Life Led to This",
      "topic": "Dramatic Monologue: Reflection on past",
      "context": "Character reflecting on journey before sacrifice play",
      "type": "TEACH"
    },
    {
      "id": 362,
      "title": "The Burden I Carry",
      "topic": "Dramatic Monologue: Expressing heavy responsibility",
      "context": "Leader contemplating weight of decisions affecting thousands",
      "type": "TEACH"
    },
    {
      "id": 363,
      "title": "This Is My Atonement",
      "topic": "Dramatic Monologue: Redemption theme",
      "context": "Reformed villain explaining reasons for helping heroes",
      "type": "TEACH"
    },
    {
      "id": 364,
      "title": "I Finally Understand",
      "topic": "Dramatic Monologue: Realization moment",
      "context": "Protagonist's epiphany about true meaning of their power",
      "type": "TEACH"
    },
    {
      "id": 365,
      "title": "Emotional Climax Scene",
      "topic": "Review: Deep Dramatic Expression",
      "context": "Creating powerful monologue for pivotal character moment",
      "type": "EXAM"
    },
    {
      "id": 366,
      "title": "Orders From High Command",
      "topic": "Military Hierarchy: Chain of command language",
      "context": "Receiving and relaying orders through proper military channels",
      "type": "TEACH"
    },
    {
      "id": 367,
      "title": "Addressing the Troops",
      "topic": "Military Speech: Motivational address",
      "context": "Commander inspiring army before major battle begins",
      "type": "TEACH"
    },
    {
      "id": 368,
      "title": "Casualty Reports",
      "topic": "Military Speech: Formal reporting of losses",
      "context": "Delivering difficult news about fallen soldiers to leadership",
      "type": "TEACH"
    },
    {
      "id": 369,
      "title": "Medal of Valor Ceremony",
      "topic": "Military Speech: Commendation language",
      "context": "Formal recognition of extraordinary heroism in battle",
      "type": "TEACH"
    },
    {
      "id": 370,
      "title": "Military Communication Protocol",
      "topic": "Review: Formal Military Language",
      "context": "Complete military briefing from greeting to dismissal",
      "type": "EXAM"
    },
    {
      "id": 371,
      "title": "The Price of Victory",
      "topic": "Philosophical Discussion: Cost and consequence",
      "context": "Post-battle reflection on whether victory was worth sacrifices",
      "type": "TEACH"
    },
    {
      "id": 372,
      "title": "What It Means to Protect",
      "topic": "Philosophical Discussion: Core values",
      "context": "Debate about true meaning of being a ninja and protecting others",
      "type": "TEACH"
    },
    {
      "id": 373,
      "title": "The Cycle of Hatred",
      "topic": "Philosophical Discussion: War and peace themes",
      "context": "Discussing how to break endless cycle of revenge and conflict",
      "type": "TEACH"
    },
    {
      "id": 374,
      "title": "Legacy and Future",
      "topic": "Philosophical Discussion: Generational responsibility",
      "context": "Veterans discussing what world they're leaving for next generation",
      "type": "TEACH"
    },
    {
      "id": 375,
      "title": "War Philosophy Debate",
      "topic": "Review: Deep Thematic Discussion",
      "context": "Formal debate on ethics and philosophy of shinobi warfare",
      "type": "EXAM"
    },
    {
      "id": 376,
      "title": "Even Though I Knew",
      "topic": "Complex Regret: [verb]とわかっていたのに",
      "context": "Acknowledging that tragedy could have been prevented",
      "type": "TEACH"
    },
    {
      "id": 377,
      "title": "If Only I Had Been Stronger",
      "topic": "Counterfactual Regret: [verb]ていれば",
      "context": "Survivor's guilt after being unable to save fallen comrades",
      "type": "TEACH"
    },
    {
      "id": 378,
      "title": "I Shouldn't Have Trusted",
      "topic": "Regret About Past: [verb]べきではなかった",
      "context": "Realizing too late that ally was actually enemy agent",
      "type": "TEACH"
    },
    {
      "id": 379,
      "title": "There's No Going Back",
      "topic": "Acceptance: もう戻れない",
      "context": "Character accepting that certain choices are irreversible",
      "type": "TEACH"
    },
    {
      "id": 380,
      "title": "Emotional Reckoning",
      "topic": "Review: Complex Regret Expressions",
      "context": "Character confronting all their regrets before final sacrifice",
      "type": "EXAM"
    },
    {
      "id": 381,
      "title": "The Enemy Has Arrived",
      "topic": "Passive Observation: [verb]られた",
      "context": "Scout reporting enemy movement to command center",
      "type": "TEACH"
    },
    {
      "id": 382,
      "title": "Our Strategy Was Leaked",
      "topic": "Passive Negative Event: 漏らされた",
      "context": "Discovering battle plans have been compromised by spy",
      "type": "TEACH"
    },
    {
      "id": 383,
      "title": "We Were Surrounded",
      "topic": "Passive Dangerous Situation: 囲まれた",
      "context": "Tactical disadvantage when enemy springs ambush",
      "type": "TEACH"
    },
    {
      "id": 384,
      "title": "The Seal Was Broken",
      "topic": "Passive Consequence: 破られた",
      "context": "Ancient seal containing powerful enemy is destroyed",
      "type": "TEACH"
    },
    {
      "id": 385,
      "title": "Tactical Situation Report",
      "topic": "Review: Passive Voice in Military Context",
      "context": "Comprehensive situation report using passive constructions",
      "type": "EXAM"
    },
    {
      "id": 386,
      "title": "Command Issued Orders",
      "topic": "Causative Leadership: [verb]させる",
      "context": "High command making subordinate units take specific actions",
      "type": "TEACH"
    },
    {
      "id": 387,
      "title": "I Made Them Retreat",
      "topic": "Causative Tactical: 撤退させる",
      "context": "Ordering strategic withdrawal to preserve forces",
      "type": "TEACH"
    },
    {
      "id": 388,
      "title": "Let Me Help You",
      "topic": "Causative Permission: [verb]させてください",
      "context": "Requesting permission to join battle against orders",
      "type": "TEACH"
    },
    {
      "id": 389,
      "title": "I Won't Let You Die",
      "topic": "Causative Prevention: [verb]させない",
      "context": "Refusing to allow teammate to make fatal sacrifice",
      "type": "TEACH"
    },
    {
      "id": 390,
      "title": "Command and Control Exercise",
      "topic": "Review: Causative in Leadership",
      "context": "War game scenario testing causative form usage in command",
      "type": "EXAM"
    },
    {
      "id": 391,
      "title": "Honorable Elder's Wisdom",
      "topic": "Maximum Respect: Advanced keigo combinations",
      "context": "Audience with legendary ninja seeking guidance for war",
      "type": "TEACH"
    },
    {
      "id": 392,
      "title": "The Feudal Lord's Decree",
      "topic": "Highest Formal: Royal/lordly speech patterns",
      "context": "Receiving direct orders from daimyo about war effort",
      "type": "TEACH"
    },
    {
      "id": 393,
      "title": "This Humble Servant",
      "topic": "Maximum Humility: Extreme humble forms",
      "context": "Speaking to deity-like figure or ancient sage",
      "type": "TEACH"
    },
    {
      "id": 394,
      "title": "Sacred Ceremony",
      "topic": "Ritual Language: Traditional formal patterns",
      "context": "Performing ancient ritual to seal great evil away",
      "type": "TEACH"
    },
    {
      "id": 395,
      "title": "Ultimate Formal Protocol",
      "topic": "Review: Highest Level Keigo",
      "context": "Meeting with all five Kage requiring perfect formal language",
      "type": "EXAM"
    },
    {
      "id": 396,
      "title": "My Resolve Is Absolute",
      "topic": "Final Declaration: Unwavering determination",
      "context": "Protagonist's final speech before ultimate confrontation",
      "type": "TEACH"
    },
    {
      "id": 397,
      "title": "This War Ends Here",
      "topic": "Dramatic Declaration: Ending conflict",
      "context": "Hero declaring intention to end cycle of hatred",
      "type": "TEACH"
    },
    {
      "id": 398,
      "title": "For Those Who Came Before",
      "topic": "Honoring the Fallen: Memorial speech",
      "context": "Remembrance ceremony for all who died in the war",
      "type": "TEACH"
    },
    {
      "id": 399,
      "title": "The New Era Begins",
      "topic": "Looking Forward: Hope and future",
      "context": "Post-war speech about building lasting peace",
      "type": "TEACH"
    },
    {
      "id": 400,
      "title": "The War Arc: Final Assessment",
      "topic": "Comprehensive Review: All Advanced Grammar",
      "context": "Ultimate examination covering all advanced war arc concepts",
      "type": "EXAM"
 },

    {
      "id": 401,
      "title": "A Single Stone, Many Ripples",
      "topic": "Kotowaza: 一石を投じる (cast a stone)",
      "context": "Discussing how one action can change the entire shinobi world",
      "type": "TEACH"
    },
    {
      "id": 402,
      "title": "The Nail That Stands Out",
      "topic": "Kotowaza: 出る杭は打たれる (tall nail gets hammered)",
      "context": "Villain explaining why they eliminated those who opposed them",
      "type": "TEACH"
    },
    {
      "id": 403,
      "title": "Even Monkeys Fall From Trees",
      "topic": "Kotowaza: 猿も木から落ちる (experts make mistakes)",
      "context": "Master admitting their failure in judgment during critical moment",
      "type": "TEACH"
    },
    {
      "id": 404,
      "title": "After Rain Comes Clear Sky",
      "topic": "Kotowaza: 雨降って地固まる (hardship strengthens)",
      "context": "Reflecting on how war made the shinobi alliance stronger",
      "type": "TEACH"
    },
    {
      "id": 405,
      "title": "Wisdom of the Ancients",
      "topic": "Review: Classical Kotowaza",
      "context": "Decoding ancient scroll filled with traditional proverbs",
      "type": "EXAM"
    },
    {
      "id": 406,
      "title": "A Frog in a Well",
      "topic": "Kotowaza: 井の中の蛙 (narrow perspective)",
      "context": "Villain realizing their worldview was limited and flawed",
      "type": "TEACH"
    },
    {
      "id": 407,
      "title": "Ten People, Ten Colors",
      "topic": "Kotowaza: 十人十色 (diversity of people)",
      "context": "Peace speech about accepting different ninja ways and villages",
      "type": "TEACH"
    },
    {
      "id": 408,
      "title": "A Rolling Stone Gathers No Moss",
      "topic": "Kotowaza: 転石苔を生ぜず (constant change)",
      "context": "Wandering sage explaining their philosophy of perpetual journey",
      "type": "TEACH"
    },
    {
      "id": 409,
      "title": "The Flower on High Peak",
      "topic": "Kotowaza: 高嶺の花 (unattainable ideal)",
      "context": "Discussion about seemingly impossible goal of world peace",
      "type": "TEACH"
    },
    {
      "id": 410,
      "title": "Proverbs in Strategy",
      "topic": "Review: Applied Kotowaza Usage",
      "context": "War council using classical wisdom to guide decisions",
      "type": "EXAM"
    },
    {
      "id": 411,
      "title": "Three Years on a Rock",
      "topic": "Kotowaza: 石の上にも三年 (perseverance pays off)",
      "context": "Training montage showing years of dedication finally bearing fruit",
      "type": "TEACH"
    },
    {
      "id": 412,
      "title": "Poison Controls Poison",
      "topic": "Kotowaza: 毒を以て毒を制す (fight fire with fire)",
      "context": "Using forbidden jutsu to counter even more dangerous technique",
      "type": "TEACH"
    },
    {
      "id": 413,
      "title": "A Single Arrow Breaks",
      "topic": "Kotowaza: 一本の矢は折れやすい (unity is strength)",
      "context": "Explaining why shinobi alliance must remain united",
      "type": "TEACH"
    },
    {
      "id": 414,
      "title": "Time Waits for No One",
      "topic": "Kotowaza: 歳月人を待たず (seize the moment)",
      "context": "Elder's final words about not delaying important decisions",
      "type": "TEACH"
    },
    {
      "id": 415,
      "title": "Living Wisdom",
      "topic": "Review: Modern Application of Kotowaza",
      "context": "Final boss battle where each proverb relates to combat strategy",
      "type": "EXAM"
    },
    {
      "id": 416,
      "title": "Talking Rough Like Osaka",
      "topic": "Kansai-ben: Basic patterns (や, ん, ねん)",
      "context": "Meeting gruff but friendly merchant from Kansai region",
      "type": "TEACH"
    },
    {
      "id": 417,
      "title": "Casual Kansai Questions",
      "topic": "Kansai-ben: Question forms (か→け, の→ん)",
      "context": "Interrogation scene with suspect who speaks thick Kansai dialect",
      "type": "TEACH"
    },
    {
      "id": 418,
      "title": "Emphatic Kansai Speech",
      "topic": "Kansai-ben: Emphasis particles (で, がな, わい)",
      "context": "Hot-blooded rival from Osaka challenging protagonist",
      "type": "TEACH"
    },
    {
      "id": 419,
      "title": "Past Tense in Kansai",
      "topic": "Kansai-ben: Past forms (た→てん, だ→やった)",
      "context": "Elder from Kyoto region recounting old war stories",
      "type": "TEACH"
    },
    {
      "id": 420,
      "title": "Regional Dialect Mission",
      "topic": "Review: Kansai-ben Comprehension",
      "context": "Undercover mission in Kansai region requiring dialect fluency",
      "type": "EXAM"
    },
    {
      "id": 421,
      "title": "The Yakuza Connection",
      "topic": "Yakuza Slang: Hierarchy terms (兄貴, 親分, 若頭)",
      "context": "Infiltrating criminal organization connected to rogue ninja",
      "type": "TEACH"
    },
    {
      "id": 422,
      "title": "Underground Business Talk",
      "topic": "Yakuza Slang: Money and deals (シノギ, ケツを持つ)",
      "context": "Negotiating with black market weapons dealer",
      "type": "TEACH"
    },
    {
      "id": 423,
      "title": "Respect and Territory",
      "topic": "Yakuza Slang: Honor code terms (仁義, 筋を通す)",
      "context": "Former yakuza member explaining their code parallels ninja way",
      "type": "TEACH"
    },
    {
      "id": 424,
      "title": "Street Fighting Words",
      "topic": "Yakuza Slang: Combat terminology (シメる, ケジメ)",
      "context": "Underground fighting tournament with criminal participants",
      "type": "TEACH"
    },
    {
      "id": 425,
      "title": "Underworld Infiltration",
      "topic": "Review: Criminal Underground Language",
      "context": "Deep cover operation requiring perfect yakuza slang usage",
      "type": "EXAM"
    },
    {
      "id": 426,
      "title": "Youth Street Slang",
      "topic": "Modern Slang: Young people's language (ヤバい, マジ, ウザい)",
      "context": "New generation of ninja using contemporary casual speech",
      "type": "TEACH"
    },
    {
      "id": 427,
      "title": "Trendy Expressions",
      "topic": "Modern Slang: Current phrases (エモい, バズる, ガチ)",
      "context": "Social media-savvy ninja spreading information through modern terms",
      "type": "TEACH"
    },
    {
      "id": 428,
      "title": "Abbreviation Culture",
      "topic": "Modern Slang: Shortened words (リア充, 既読スルー, KY)",
      "context": "Decoding enemy communications using youth abbreviations",
      "type": "TEACH"
    },
    {
      "id": 429,
      "title": "Generation Gap",
      "topic": "Modern Slang: Age differences in speech",
      "context": "Comedy scene where old sensei doesn't understand young ninja's slang",
      "type": "TEACH"
    },
    {
      "id": 430,
      "title": "Linguistic Diversity Test",
      "topic": "Review: All Dialects and Slang",
      "context": "Mission requiring code-switching between multiple speech styles",
      "type": "EXAM"
    },
    {
      "id": 431,
      "title": "Be That As It May",
      "topic": "N1 Grammar: とはいえ (even so/nevertheless)",
      "context": "Acknowledging enemy's point but maintaining opposition",
      "type": "TEACH"
    },
    {
      "id": 432,
      "title": "Contrary to Expectations",
      "topic": "N1 Grammar: に反して (contrary to)",
      "context": "Outcome of peace talks differed from all predictions",
      "type": "TEACH"
    },
    {
      "id": 433,
      "title": "On the Verge Of",
      "topic": "N1 Grammar: んばかりに (as if about to)",
      "context": "Describing tension so thick war could restart any moment",
      "type": "TEACH"
    },
    {
      "id": 434,
      "title": "By No Means",
      "topic": "N1 Grammar: 決して〜ない (by no means)",
      "context": "Absolute denial that peace is impossible despite obstacles",
      "type": "TEACH"
    },
    {
      "id": 435,
      "title": "Advanced Grammar Integration",
      "topic": "Review: N1 Grammar Patterns Set 1",
      "context": "Complex diplomatic document requiring advanced grammar",
      "type": "EXAM"
    },
    {
      "id": 436,
      "title": "Not to Mention",
      "topic": "N1 Grammar: はおろか (not to mention/let alone)",
      "context": "Describing how final boss is beyond even legendary ninja",
      "type": "TEACH"
    },
    {
      "id": 437,
      "title": "Without Fail",
      "topic": "N1 Grammar: きっと〜に違いない (definitely/without doubt)",
      "context": "Prophecy about inevitable confrontation between rivals",
      "type": "TEACH"
    },
    {
      "id": 438,
      "title": "At the Cost Of",
      "topic": "N1 Grammar: を犠牲にして (at the sacrifice of)",
      "context": "Discussing what was sacrificed to achieve current peace",
      "type": "TEACH"
    },
    {
      "id": 439,
      "title": "Leaving Aside",
      "topic": "N1 Grammar: はさておき (leaving aside/apart from)",
      "context": "Focusing on urgent matters while tabling philosophical debates",
      "type": "TEACH"
    },
    {
      "id": 440,
      "title": "Nuanced Expression Mastery",
      "topic": "Review: N1 Grammar Patterns Set 2",
      "context": "Peace treaty negotiations requiring subtle distinctions",
      "type": "EXAM"
    },
    {
      "id": 441,
      "title": "In Light Of",
      "topic": "N1 Grammar: に鑑みて (in light of/considering)",
      "context": "Making decisions based on historical precedent and wisdom",
      "type": "TEACH"
    },
    {
      "id": 442,
      "title": "To the Extent That",
      "topic": "N1 Grammar: に至るまで (to the extent that)",
      "context": "Describing thoroughness of new peace security measures",
      "type": "TEACH"
    },
    {
      "id": 443,
      "title": "Much Less",
      "topic": "N1 Grammar: どころか (far from/much less)",
      "context": "Situation is far worse than anyone initially believed",
      "type": "TEACH"
    },
    {
      "id": 444,
      "title": "Be Bound To",
      "topic": "N1 Grammar: ざるを得ない (cannot help but/must)",
      "context": "Being forced to take action despite moral reservations",
      "type": "TEACH"
    },
    {
      "id": 445,
      "title": "Supreme Grammar Proficiency",
      "topic": "Review: N1 Grammar Patterns Set 3",
      "context": "Ancient scroll written in highest literary Japanese",
      "type": "EXAM"
    },
    {
      "id": 446,
      "title": "The Nature of Existence",
      "topic": "Philosophy: 存在の意味 (meaning of existence)",
      "context": "Final boss questioning why humans continue to fight",
      "type": "TEACH"
    },
    {
      "id": 447,
      "title": "The Duality of Man",
      "topic": "Philosophy: 善悪二元論 (good and evil duality)",
      "context": "Debate about whether people are inherently good or evil",
      "type": "TEACH"
    },
    {
      "id": 448,
      "title": "The Path and The Way",
      "topic": "Philosophy: 道 (the way/path in life)",
      "context": "Discussion of bushido and ninja way as life philosophies",
      "type": "TEACH"
    },
    {
      "id": 449,
      "title": "Impermanence of All Things",
      "topic": "Philosophy: 諸行無常 (all things are impermanent)",
      "context": "Buddhist concepts applied to understanding cycle of hatred",
      "type": "TEACH"
    },
    {
      "id": 450,
      "title": "Philosophical Discourse",
      "topic": "Review: Deep Philosophical Concepts",
      "context": "Summit of world leaders discussing nature of peace and war",
      "type": "EXAM"
    },
    {
      "id": 451,
      "title": "Autumn Leaves Falling",
      "topic": "Poetic Expression: Nature imagery in emotion",
      "context": "Describing melancholy of war's end through seasonal metaphor",
      "type": "TEACH"
    },
    {
      "id": 452,
      "title": "Moon's Reflection on Water",
      "topic": "Poetic Expression: Illusion and reality (鏡花水月)",
      "context": "Describing genjutsu or false peace using poetic language",
      "type": "TEACH"
    },
    {
      "id": 453,
      "title": "Cherry Blossoms Scatter",
      "topic": "Poetic Expression: Beauty in transience (散る桜)",
      "context": "Memorial for fallen ninja using traditional poetry",
      "type": "TEACH"
    },
    {
      "id": 454,
      "title": "The Crane's Cry at Dawn",
      "topic": "Poetic Expression: Loneliness and beauty (暁の鶴)",
      "context": "Describing solitude of being the last survivor",
      "type": "TEACH"
    },
    {
      "id": 455,
      "title": "Mastery of Poetic Language",
      "topic": "Review: Classical Poetry Expressions",
      "context": "Composing haiku and waka for victory monument",
      "type": "EXAM"
    },
    {
      "id": 456,
      "title": "The Wind Knows",
      "topic": "Poetic Expression: Natural wisdom (風の便り)",
      "context": "Using nature metaphors to convey information subtly",
      "type": "TEACH"
    },
    {
      "id": 457,
      "title": "Snow Covers the Mountain",
      "topic": "Poetic Expression: Purity and concealment",
      "context": "Describing how peace covers but doesn't erase past wounds",
      "type": "TEACH"
    },
    {
      "id": 458,
      "title": "Thunder Without Rain",
      "topic": "Poetic Expression: Empty threats (雷鳴)",
      "context": "Criticizing politicians who talk but don't act",
      "type": "TEACH"
    },
    {
      "id": 459,
      "title": "The Dragon Sleeps",
      "topic": "Poetic Expression: Hidden power (臥龍)",
      "context": "Warning about dormant threats that could awaken",
      "type": "TEACH"
    },
    {
      "id": 460,
      "title": "Eloquent Natural Imagery",
      "topic": "Review: Advanced Poetic Metaphors",
      "context": "Crafting speech that moves hearts using nature imagery",
      "type": "EXAM"
    },
    {
      "id": 461,
      "title": "Breaking News From Front",
      "topic": "News Language: Headline structure",
      "context": "Reading urgent reports about final battle developments",
      "type": "TEACH"
    },
    {
      "id": 462,
      "title": "Official Government Statement",
      "topic": "Political Terms: 声明 (statement) and formal announcements",
      "context": "Hokage's formal declaration about post-war reconstruction",
      "type": "TEACH"
    },
    {
      "id": 463,
      "title": "Peace Treaty Ratification",
      "topic": "Political Terms: 批准 (ratification) and legal process",
      "context": "Process of making peace agreement legally binding",
      "type": "TEACH"
    },
    {
      "id": 464,
      "title": "Diplomatic Relations",
      "topic": "Political Terms: 外交関係 (diplomatic relations)",
      "context": "Establishing formal relationships between former enemy villages",
      "type": "TEACH"
    },
    {
      "id": 465,
      "title": "Political Communication",
      "topic": "Review: News and Political Language",
      "context": "Comprehensive briefing document in official government style",
      "type": "EXAM"
    },
    {
      "id": 466,
      "title": "Summit Conference",
      "topic": "Political Terms: 首脳会談 (summit meeting)",
      "context": "Five Kage Summit to discuss continental security",
      "type": "TEACH"
    },
    {
      "id": 467,
      "title": "Unanimous Resolution",
      "topic": "Political Terms: 全会一致 (unanimous decision)",
      "context": "Historic moment when all villages agree on policy",
      "type": "TEACH"
    },
    {
      "id": 468,
      "title": "Sanctions and Embargoes",
      "topic": "Political Terms: 制裁 (sanctions) for rogue states",
      "context": "Punishing villages that violate peace agreement",
      "type": "TEACH"
    },
    {
      "id": 469,
      "title": "Territorial Sovereignty",
      "topic": "Political Terms: 領土主権 (territorial sovereignty)",
      "context": "Negotiating border disputes between nations",
      "type": "TEACH"
    },
    {
      "id": 470,
      "title": "International Relations",
      "topic": "Review: Complex Political Concepts",
      "context": "World peace conference requiring all political terminology",
      "type": "EXAM"
    },
    {
      "id": 471,
      "title": "The Final Confrontation",
      "topic": "Literary Battle Description: Epic combat narrative",
      "context": "Describing ultimate battle using highest literary style",
      "type": "TEACH"
    },
    {
      "id": 472,
      "title": "Clash of Ideologies",
      "topic": "Abstract Debate: Philosophical combat",
      "context": "Hero and villain's final debate about nature of peace",
      "type": "TEACH"
    },
    {
      "id": 473,
      "title": "The Power of Bonds",
      "topic": "Thematic Expression: 絆 (bonds) and connection",
      "context": "Protagonist's speech about what truly gives strength",
      "type": "TEACH"
    },
    {
      "id": 474,
      "title": "Surpassing the Legend",
      "topic": "Comparative Excellence: Exceeding predecessors",
      "context": "Achieving what even legendary past heroes couldn't",
      "type": "TEACH"
    },
    {
      "id": 475,
      "title": "Ultimate Battle Mastery",
      "topic": "Review: Epic Narrative Construction",
      "context": "Chronicling final battle for historical records",
      "type": "EXAM"
    },
    {
      "id": 476,
      "title": "Ancient Scrolls Deciphered",
      "topic": "Classical Japanese: Reading old texts (候文)",
      "context": "Unlocking secrets from centuries-old ninja scrolls",
      "type": "TEACH"
    },
    {
      "id": 477,
      "title": "The First Hokage's Will",
      "topic": "Classical Japanese: Testament and legacy documents",
      "context": "Reading founder's original vision for the village",
      "type": "TEACH"
    },
    {
      "id": 478,
      "title": "Prophecy Interpretation",
      "topic": "Classical Japanese: Religious and mystical texts",
      "context": "Understanding ancient prophecy about child of destiny",
      "type": "TEACH"
    },
    {
      "id": 479,
      "title": "Forbidden Technique Scroll",
      "topic": "Classical Japanese: Technical ancient documentation",
      "context": "Learning ultimate jutsu from archaic instruction manual",
      "type": "TEACH"
    },
    {
      "id": 480,
      "title": "Historical Text Analysis",
      "topic": "Review: Classical Document Reading",
      "context": "Comprehensive examination of various ancient scroll types",
      "type": "EXAM"
    },
    {
      "id": 481,
      "title": "The Price We Paid",
      "topic": "Reflective Narrative: War's toll",
      "context": "Contemplating all that was lost to achieve peace",
      "type": "TEACH"
    },
    {
      "id": 482,
      "title": "Those Who Remain",
      "topic": "Survivor's Narrative: Honoring the dead",
      "context": "Speaking for those who didn't live to see peace",
      "type": "TEACH"
    },
    {
      "id": 483,
      "title": "A New Generation Rises",
      "topic": "Hope Narrative: Future generations",
      "context": "Watching young ninja who never knew war train together",
      "type": "TEACH"
    },
    {
      "id": 484,
      "title": "The Cycle Ends Here",
      "topic": "Resolution Narrative: Breaking patterns",
      "context": "Declaring end to cycle of hatred that plagued generations",
      "type": "TEACH"
    },
    {
      "id": 485,
      "title": "Epilogue Composition",
      "topic": "Review: Narrative Closure Techniques",
      "context": "Writing the conclusion to the great shinobi war saga",
      "type": "EXAM"
    },
    {
      "id": 486,
      "title": "Between Life and Death",
      "topic": "Existential Expression: Life's boundary",
      "context": "Near-death experience providing ultimate enlightenment",
      "type": "TEACH"
    },
    {
      "id": 487,
      "title": "The Weight of a Name",
      "topic": "Identity Philosophy: Names and legacy",
      "context": "Discussion of what it means to inherit legendary title",
      "type": "TEACH"
    },
    {
      "id": 488,
      "title": "What Remains When Power Fades",
      "topic": "Essence Philosophy: True self beyond ability",
      "context": "Hero who lost powers discovering their real worth",
      "type": "TEACH"
    },
    {
      "id": 489,
      "title": "The Last Lesson",
      "topic": "Master's Final Teaching: Ultimate wisdom",
      "context": "Dying master's final words to student before passing",
      "type": "TEACH"
    },
    {
      "id": 490,
      "title": "Philosophical Mastery",
      "topic": "Review: Ultimate Wisdom Expression",
      "context": "Demonstrating complete understanding of life's deepest questions",
      "type": "EXAM"
    },
    {
      "id": 491,
      "title": "The Throne of Kage",
      "topic": "Leadership Language: Succession and authority",
      "context": "Ceremony where protagonist becomes next Hokage",
      "type": "TEACH"
    },
    {
      "id": 492,
      "title": "Addressing the World",
      "topic": "Global Leadership: Speaking to all nations",
      "context": "First speech as Kage to entire shinobi world",
      "type": "TEACH"
    },
    {
      "id": 493,
      "title": "The Burden of the Hat",
      "topic": "Leadership Reflection: Responsibility and sacrifice",
      "context": "Understanding what previous Kage endured for village",
      "type": "TEACH"
    },
    {
      "id": 494,
      "title": "Passing the Torch",
      "topic": "Mentorship Language: Training successor",
      "context": "Preparing next generation to eventually inherit title",
      "type": "TEACH"
    },
    {
      "id": 495,
      "title": "Leadership Excellence",
      "topic": "Review: Complete Leadership Language",
      "context": "Final test of ability to lead and inspire as Kage",
      "type": "EXAM"
    },
    {
      "id": 496,
      "title": "The Journey's True Meaning",
      "topic": "Ultimate Realization: Life's purpose",
      "context": "Final understanding that journey was more important than destination",
      "type": "TEACH"
    },
    {
      "id": 497,
      "title": "Full Circle",
      "topic": "Narrative Completion: Returning to beginning",
      "context": "Realizing how far you've come from academy graduation day",
      "type": "TEACH"
    },
    {
      "id": 498,
      "title": "Words for Eternity",
      "topic": "Legacy Statement: Final message to future",
      "context": "Recording your story and wisdom for generations to come",
      "type": "TEACH"
    },
    {
      "id": 499,
      "title": "The Ending is a Beginning",
      "topic": "Continuation Theme: Life goes on",
      "context": "Understanding that peace requires constant vigilance and work",
      "type": "TEACH"
    },
    {
      "id": 500,
      "title": "The Kage's Final Trial: Mastery Achieved",
      "topic": "Comprehensive Review: Complete Japanese Mastery",
      "context": "Ultimate examination covering all 500 lessons from Genin to Kage",
      "type": "EXAM"
    },
   




];

// هذا السطر السحري يحول المصفوفة إلى الشكل الذي يريده الكود
export const FULL_CURRICULUM = RAW_LESSONS.reduce((acc, lesson) => {
    acc[lesson.id] = lesson;
    return acc;
}, {});
