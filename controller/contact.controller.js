const db = require("../models/db")
const Op = db.Sequelize.Op;
const Contact = db.contacts;


//Create and save new contact
exports.create = async (req,res) => {
    return await createNewContact(req,res);
   
}

 const createNewContact = async (req,res) => {
    try {
        const { email, phoneNumber } = req.body;

        // Validate input
        if (!email && !phoneNumber) {
            return res.status(400).send({
                message: "Email or phone number is required."
            });
        }

        // Create a new contact
        const newContact = await Contact.create({
            email,
            phoneNumber,
            linkPrecedence: 'primary', 
        });

        // Send a success response
        return res.status(201).send(newContact);
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).send({
            message: "An error occurred while creating the contact."
        });
    }
}


const updatePrecedence = async (contacts) => {
    // Filter primary contacts
    const primaryContacts = contacts.filter(contact => contact.linkPrecedence === 'primary');

    if (primaryContacts.length > 1) {
        // Sort primary contacts by createdAt date
        primaryContacts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        // Make the oldest one primary and others secondary
        const oldestPrimary = primaryContacts[0];
        await Contact.update(
            { linkPrecedence: 'primary' },
            { where: { id: oldestPrimary.id } }
        );

        for (let i = 1; i < primaryContacts.length; i++) {
            await Contact.update(
                { linkPrecedence: 'secondary', linkedId: oldestPrimary.id },
                { where: { id: primaryContacts[i].id } }
            );
        }
    }

    // Ensure the rest of the contacts are secondary if not already primary
    const secondaryContacts = contacts.filter(contact => contact.linkPrecedence !== 'primary');
    for (let contact of secondaryContacts) {
        await Contact.update(
            { linkPrecedence: 'secondary', linkedId: primaryContacts[0].id },
            { where: { id: contact.id } }
        );
    }
};


exports.findAll = async (req, res) => {
 

  try {
        const { email, phoneNumber } = req.body;

        // Validate input
        if (!email && !phoneNumber) {
            return res.status(400).send({
                message: "Email or phone number is required."
            });
        }

        // Create a new contact

         // Create the OR condition object
        const condition = {
            [Op.or]: []
        };

        if (email) condition[Op.or].push({ email });
        if (phoneNumber) condition[Op.or].push({ phoneNumber });

        const contacts = await Contact.findAll({
            where: condition,
            order: [['createdAt', 'ASC']]
        });

        if(contacts.length  === 0){
            return createNewContact(req,res)
        }

        await updatePrecedence(contacts);

        const updatedContacts = await Contact.findAll({
            where: condition,
            order: [['createdAt', 'ASC']]
        });

        // Construct the desired response format directly from updatedContacts
        const primaryContact = updatedContacts.find(contact => contact.linkPrecedence === 'primary');
        const primaryContactId = primaryContact ? primaryContact.id : null;
        const emails = updatedContacts.map(contact => contact.email);
        const phoneNumbers = updatedContacts.map(contact => contact.phoneNumber);
        const secondaryContactIds = updatedContacts
            .filter(contact => contact.linkPrecedence === 'secondary')
            .map(contact => contact.id);

        // Construct the response object
        const response = {
            contact: {
                primaryContactId,
                emails,
                phoneNumbers,
                secondaryContactIds
            }
        };


        // Send a success response
        return res.status(201).send(response);
    } catch (error) {
        // Handle errors
        console.error(error);
        return res.status(500).send({
            message: "An error occurred while retrieving the contacts."
        });
    }
};

