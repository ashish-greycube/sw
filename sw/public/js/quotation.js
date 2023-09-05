// frappe.ui.form.on('Quotation', {
// 	refresh:function(frm) {
// 		frm.add_custom_button("Customer Measurement",function(){
//             var customerMeasurement = frappe.new_doc("Customer Measurement", {
                
//                 customer: frm.doc.party_name,
// 				qtn_reference : frm.doc.name,

// 			})
// 			customerMeasurement.save().then(function() {
//                 frappe.set_route("Form", "Customer Measurement", customerMeasurement.name);
//             });
            
// 		});
// 	}
// })




frappe.ui.form.on('Quotation', {
    refresh: function(frm) {
        frappe.call({
            method: 'frappe.client.get_list',
            args: {
                doctype: 'Customer Measurement',
                filters: { qtn_reference: frm.doc.name },
                limit: 1,
            },
            callback: function(r) {
                if (r.message && r.message.length > 0) {
                    frm.remove_custom_button("Customer Measurement");
                } else {
                    frm.add_custom_button("Customer Measurement", function() {
                        frappe.new_doc("Customer Measurement", {
                            customer: frm.doc.party_name,
                            qtn_reference: frm.doc.name,
                            
                        }).then(function(doc) {
                            frappe.set_route("Form", "Customer Measurement", doc.name);
                        });
                    });
                }
            }
        });
    }


	

});

