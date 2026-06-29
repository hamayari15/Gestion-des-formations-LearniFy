const Inscription = require("../models/Inscription.model");


exports.addInscription = async (req, res) => {
  const {
    theme,
    fullname,
    email,
    entreprise,
    service,
    numSalle,
  } = req.body;

  const { participantId, formationId } = req.params;

  if (
    !theme ||
    !fullname ||
    !email ||
    !entreprise ||
    !service ||
    !numSalle
  ) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    const inscription = new Inscription({
      numSalle,
      theme,
      fullname,
      email,
      entreprise,
      service,
      participantId,
      formationId,
    });

    const savedInscription =
      await inscription.save();

    res.status(201).json(savedInscription);

  } catch (error) {
    console.error(error);

    if (error.code === 11000) {
      const duplicatedField =
        error.keyValue.fullname
          ? "fullname"
          : "email";

      return res.status(400).json({
        message: `${duplicatedField} already exists.`,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};


exports.getInscriptions = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    const search = req.query.search || '';
    const sort = req.query.sort || 'desc';

    const skip = (page - 1) * limit;

    let query = {};

    if (search) {
      query.theme = {
        $regex: search,
        $options: 'i'
      };
    }

    const totalItems = await Inscription.countDocuments(query);

    const inscriptions = await Inscription.find(query)
      .sort({ createdAt: sort === 'asc' ? 1 : -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      success: true,
      data: {
        inscriptions,
        currentPage: page,
        totalPages: Math.ceil(totalItems / limit),
        totalItems
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// exports.getInscriptionById = async (
//   req,
//   res
// ) => {
//   try {
//     const inscription =
//       await Inscription.findById(
//         req.params.id
//       );

//     if (!inscription) {
//       return res.status(404).json({
//         message: "Inscription not found.",
//       });
//     }

//     res.status(200).json(inscription);

//   } catch (error) {
//     res.status(500).json({
//       message: error.message,
//     });
//   }
// };


exports.updateInscription = async (
  req,
  res
) => {
  try {
    const inscription =
      await Inscription.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!inscription) {
      return res.status(404).json({
        message: "Inscription not found",
      });
    }

    res.status(200).json(inscription);

  } catch (error) {
    res.status(500).json({
      message: "Server error",
    });
  }
};


exports.updateStatus = async (
  req,
  res
) => {
  const { status } = req.body;

  if (
    !["Validée", "Refusée", "En Attente"].includes(
      status
    )
  ) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  try {
    const inscription =
      await Inscription.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

    if (!inscription) {
      return res.status(404).json({
        message: "Inscription not found",
      });
    }

    res.status(200).json({
      message:
        "Status updated successfully",
      inscription,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};