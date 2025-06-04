import db from '../models/index.js';
const { ScheduledOutfit, Outfit } = db;

// Controller function to schedule an outfit
export const scheduleOutfit = async (req, res) => {
  try {
    const { id_outfit, scheduled_date } = req.body;
    const id_user = req.user.userId; // Assuming user ID is available from the token

    // Check if an outfit is already scheduled for this user on this date
    const existingSchedule = await ScheduledOutfit.findOne({
        where: {
            id_user: id_user,
            scheduled_date: scheduled_date,
        }
    });

    if (existingSchedule) {
        // If exists, update it
        existingSchedule.id_outfit = id_outfit;
        await existingSchedule.save();
        console.log(`Scheduled outfit updated for user ${id_user} on ${scheduled_date}`);
        return res.status(200).json(existingSchedule); // Use 200 for update
    } else {
        // If not exists, create a new one
        const newScheduledOutfit = await ScheduledOutfit.create({
            id_user: id_user,
            id_outfit: id_outfit,
            scheduled_date: scheduled_date,
        });
        console.log(`Outfit ${id_outfit} scheduled for user ${id_user} on ${scheduled_date}`);
        return res.status(201).json(newScheduledOutfit); // Use 201 for creation
    }

  } catch (error) {
    console.error('Error scheduling outfit:', error);
    res.status(500).json({ message: 'Server error while scheduling outfit.' });
  }
};

// Controller function to get scheduled outfit by user and date
export const getScheduledOutfitByDate = async (req, res) => {
  let userId; // Declare userId here
  let date;   // Declare date here
  try {
    ({ userId, date } = req.params); // Assign values here

    // First, try to find a scheduled outfit in the scheduled_outfits table
    const scheduledOutfitEntry = await ScheduledOutfit.findOne({
      where: {
        id_user: userId,
        scheduled_date: date,
      },
      include: [{
        model: Outfit,
        as: 'outfit', // Use the alias defined in the association
        // Include ClothingItems when fetching the associated outfit
        include: [
            {
                model: db.ClothingItem,
                through: 'OutfitItems', // Specify the junction table
            }
        ],
        attributes: ['id', 'name', 'image_url'], // Specify attributes to include
      }],
    });

    if (scheduledOutfitEntry) {
      // If a scheduled outfit is found, return its associated outfit details (which now includes items)
      console.log(`Found scheduled outfit entry for user ${userId} on ${date}. Returning associated outfit with items.`);
      return res.json(scheduledOutfitEntry.outfit);
    }

    // If no scheduled outfit is found, try to find an outfit in the outfits table with a matching date
    console.log(`No scheduled outfit entry found for user ${userId} on ${date}. Checking outfits table for matching date...`);
    const outfitWithDate = await Outfit.findOne({
        where: {
            userId: userId,
            date: date, // Check the 'date' column in the outfits table
        },
        // Include ClothingItems when fetching this outfit
        include: [
            {
                model: db.ClothingItem,
                through: 'OutfitItems', // Specify the junction table
            }
        ],
         attributes: ['id', 'name', 'image_url'], // Specify attributes to include
    });

    if (outfitWithDate) {
        // If an outfit with a matching date is found, return it (which now includes items)
        console.log(`Found outfit with matching date for user ${userId} on ${date}. Returning outfit with items.`);
        return res.json(outfitWithDate);
    }

    // If neither is found, return 404
    console.log(`No scheduled outfit entry or outfit with matching date found for user ${userId} on ${date}. Returning 404.`);
    return res.status(404).json({ message: 'No outfit scheduled or saved with this date.' });

  } catch (error) {
    console.error(`Error fetching outfit for user ${userId} on ${date}:`, error); // userId and date are now in scope
    res.status(500).json({ message: 'Server error while fetching outfit.' });
  }
};

// Removed Controller function to get all dates with scheduled or saved outfits for a user
// export const getDatesWithOutfits = async (req, res) => {
//   try {
//     const userId = req.user.userId; // Get userId from authenticated user

//     // Find dates from scheduled_outfits
//     const scheduledDates = await ScheduledOutfit.findAll({
//       where: {
//         id_user: userId,
//       },
//       attributes: ['scheduled_date'],
//       group: ['scheduled_date'], // Group by date to get unique dates
//     });

//     // Find dates from outfits table with a date set
//     const outfitDates = await Outfit.findAll({
//         where: {
//             userId: userId,
//             date: { // Only include outfits where the date is not null
//                  [db.Sequelize.Op.ne]: null
//             }
//         },
//         attributes: ['date'],
//         group: ['date'], // Group by date to get unique dates
//     });

//     // Combine and unique the dates
//     const allDates = scheduledDates.map(entry => entry.scheduled_date).concat(
//         outfitDates.map(entry => entry.date)
//     );

//     const uniqueDates = [...new Set(allDates)]; // Get unique dates

//     console.log(`Found dates with outfits for user ${userId}: ${uniqueDates}`);
//     res.json(uniqueDates);

//   } catch (error) {
//     console.error(`Error fetching dates with outfits for user ${userId}:`, error);
//     res.status(500).json({ message: 'Server error while fetching dates with outfits.' });
//   }
// }; 