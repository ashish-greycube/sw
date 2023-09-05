// frappe.ui.form.on('Sales Order', {
//     onload: function(frm) {
//         // Fetch and print the value of prevdoc_docname for each Sales Order Item
//         frm.doc.items.forEach(function(item) {
//             var quotationName = item.prevdoc_docname;
//             if (quotationName) {
//                 frappe.msgprint("Quotation Name for Item: " + quotationName);
//             }
//         });
//     }
// });









// frappe.ui.form.on('Sales Order', {
// 	refresh:function(frm) {
// 		frm.add_custom_button("Customer Measurement",function(){
//             var customerMeasurement = frappe.new_doc("Customer Measurement", {
                
//                 customer: frm.doc.customer,
// 				so_reference : frm.doc.name,

// 			})
// 			customerMeasurement.save().then(function() {
//                 frappe.set_route("Form", "Customer Measurement", customerMeasurement.name);
//             });
            
// 		});
// 	}
// })





// frappe.ui.form.on('Sales Order', {
//     refresh: function(frm) {
       
//         frappe.call({
//             method: 'frappe.client.get_list',
//             args: {
//                 doctype: 'Customer Measurement',
//                 filters: { qtn_reference: frm.doc.name },
//                 limit: 1,
//             },
            
//             callback: function(r) {
//                 if (r.message && r.message.length > 0) {
//                     frm.remove_custom_button("Customer Measurement");
//                 } else {
                    
//                     addCustomerMeasurementButton(frm);
//                 }
//             }
//         });
//     }
// });

// function addCustomerMeasurementButton(frm) {
//     frm.add_custom_button("Customer Measurement", function() {
       
//        frappe.new_doc("Customer Measurement", {
//             customer: frm.doc.customer,
//             so_reference: frm.doc.name,
//         }).then(function(doc) {
//         frappe.set_route("Form", "Customer Measurement", doc.name);
//         });
//     });
// }




// frappe.ui.form.on('Sales Order', {
//     refresh: function(frm) {
//         // Check for the existence of "Customer Measurement" documents
//         checkCustomerMeasurementButtonVisibility(frm);
//     }
// });

// frappe.ui.form.on('Sales Order Item', {
//     prevdoc_docname: function(frm, cdt, cdn) {
//         // Trigger the check when the Quotation name field in the child table is changed
//         checkCustomerMeasurementButtonVisibility(frm);
//     }
// });

// function checkCustomerMeasurementButtonVisibility(frm) {
//     var quotationName = frm.doc.prevdoc_docname;
    
//     if (!quotationName) {
//         // No Quotation name is set, do nothing
//         return;
//     }

//     // Check if "Customer Measurement" documents exist for the Quotation
//     frappe.call({
//         method: 'frappe.client.get_list',
//         args: {
//             doctype: 'Customer Measurement',
//             filters: { qtn_reference: quotationName },
//             limit: 1,
//         },
//         callback: function(r) {
//             if (r.message && r.message.length > 0) {
//                 // A Customer Measurement document exists, so hide the button
//                 frm.remove_custom_button("Customer Measurement");
//             } else {
//                 // No Customer Measurement document exists, so add the button
//                 addCustomerMeasurementButton(frm);
//             }
//         }
//     });
// }

// function addCustomerMeasurementButton(frm) {
//     frm.add_custom_button("Customer Measurement", function() {
//         // Your button click logic here
//         // Create the Customer Measurement document, set the fields, and route to the form
//     });
// }
