frappe.ui.form.on('Quotation', {
    refresh: function (frm) {
        if (!frm.is_new()) {
            frappe.call({
                method: 'frappe.client.get_list',
                args: {
                    doctype: 'Customer Measurement',
                    filters: {
                        qtn_reference_cf: frm.doc.name
                    },
                    limit: 1,
                },
                callback: function (r) {
                    if (r.message && r.message.length > 0) {
                        frm.remove_custom_button("Create Measurement");
                    } else {
                        frm.add_custom_button("Create Measurement", function () {
                            frappe.new_doc("Customer Measurement", {
                                customer: frm.doc.party_name,
                                qtn_reference_cf: frm.doc.name,

                            }).then(function (doc) {
                                frappe.set_route("Form", "Customer Measurement", doc.name);
                            });
                        });

                    }
                }
            });
        }

    }
});