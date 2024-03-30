const e = require('express');
const Customer = require('../model/customer');



//homepage with pagination
// exports.homepage = async (req, res) => {

//     const successMessages = req.flash('success'); // Retrieve success flash messages
//     const locals = {
//       title: 'Homepage',
//       description: 'This is the homepage'
//     }
//     let perpage = 10;
//     let page = req.query.page || 1;
//     try {
//       const customers = await Customer.aggregate([{$sort:{updatedAt:1}}])
//       .skip((perpage * page) - perpage)
//       .limit(perpage)
//       .exec();
//       const count = await Customer.countDocuments();
//       res.render('index', { locals, successMessages,customers, current: page, pages: Math.ceil(count / perpage) });

//     } catch (error) {
//       console.error(error);
//       res.status(500).send('Server Error');
//     }
    
  
// };
exports.homepage = async (req, res) => {
  const successMessages = req.flash('success'); // Retrieve success flash messages
  const locals = {
    title: 'Homepage',
    description: 'This is the homepage',
  };
  let perpage = 10;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([{ $sort: { updatedAt: 1 } }])
      .skip((perpage * page) - perpage)
      .limit(perpage)
      .exec();
    const count = await Customer.countDocuments();

    res.render('index', {
      locals,
      successMessages, // Pass successMessages to the template
      customers,
      current: page,
      pages: Math.ceil(count / perpage),
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};




exports.addcustomer = async (req, res) => {
  const locals = {
    title: 'Add Customer',
    description: 'This is the add customer page'
  };
  res.render('customer/add', locals);
};

exports.postcustomer = async (req, res) => {
  console.log(req.body);
  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    tel: req.body.tel,
    email: req.body.email,
  });

  try {
    await Customer.create(newCustomer);
    req.flash('success', 'Customer added successfully'); // Set success flash message
    res.redirect("/");
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
};

exports.view = async (req, res) => {
  const locals = {
    title: 'View Customer',
    description: 'This is the view customer page'
  };
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    const locals = {
      title: 'View Customer',
      description: 'This is the view customer page'
    };
    res.render('customer/view', { locals, customer });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

exports.edit = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });
    const locals = {
      title: 'Edit Customer',
      description: 'This is the edit customer page'
    };
    res.render('customer/edit', { locals, customer });
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
}

// exports.editpost = async (req, res) => {
//   try {
//     await Customer.findOneAndUpdate({ _id: req.params.id }, {
//       firstName: req.body.firstName,
//       lastName: req.body.lastName,
//       tel: req.body.tel,
//       email: req.body.email,
//       details: req.body.details,
//       updatedAt: Date.now()
//     });
//     res.redirect(`/edit/${req.params.id}`);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Server Error');
//   }
// }
exports.editpost = async (req, res) => {
  try {
    const updatedCustomer = await Customer.findOneAndUpdate(
      { _id: req.params.id },
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
        details: req.body.details,
        updatedAt: Date.now(),
      },
      { new: true } // To return the updated document
    );
    if (!updatedCustomer) {
      req.flash('error', 'Customer not found'); // Set error flash message if customer was not found
    } else {
      req.flash('success', `customer '${updatedCustomer.firstName} ${updatedCustomer.lastName}' updated successfully`); // Set success flash message
    }
    res.redirect('/'); // Redirect to the home page
  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error'); // Set error flash message for server error
    res.status(500).send('Server Error');
  }
};


exports.deletecustomer = async (req, res) => {
  try {
    const deletedCustomer = await Customer.findOneAndDelete({ _id: req.params.id });
    if (!deletedCustomer) {
      req.flash('error', 'Customer not found'); // Set error flash message if customer was not found
    } else {
      req.flash('success', `Customer '${deletedCustomer.firstName} ${deletedCustomer.lastName}' deleted successfully`); // Set success flash message
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Server Error'); // Set error flash message for server error
    res.status(500).send('Server Error');
  }
}

exports.searchcustomer = async (req, res) =>{
  locals = {
    title: 'Search Customer',
    description: 'This is the search customer page'
  };
  try{
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, '');
    const customers = await Customer.find({$or:[{firstName:{$regex:searchNoSpecialChars,$options:'i'}},{lastName:{$regex:searchNoSpecialChars,$options:'i'}}]});
    res.render('search',{customers,locals});
  }
  catch(error){
    console.error(error);
    res.status(500).send('Server Error');
  }
}

exports.about = async (req, res) => {
  const locals = {
    title: 'About',
    description: 'This is the about page'
  };
  res.render('about', locals);
};