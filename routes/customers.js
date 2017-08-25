
/*
 * GET users listing.
 */

exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer',function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('customers',{page_title:"Customers - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    });
  
};

exports.add = function(req, res){
  res.render('add_customer',{page_title:"Add Customers - Node.js"});
};

exports.edit = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer WHERE id = ?',[id],function(err,rows)
        {
            
            if(err)
                console.log("Error Selecting : %s ",err );
     
            res.render('edit_customer',{page_title:"Edit Customers - Node.js",data:rows});
                
           
         });
         
         //console.log(query.sql);
    }); 
};

/*Save the customer*/
exports.save = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone, 
            status  : 'Verified'
        };
        
        var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        {
  
          if (err)
              console.log("Error inserting : %s ",err );
         
          res.redirect('/customers');
          
        });
        
       // console.log(query.sql); get raw query
    
    });
};

exports.save_edit = function(req,res){
    
    var input = JSON.parse(JSON.stringify(req.body));
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            name    : input.name,
            address : input.address,
            email   : input.email,
            phone   : input.phone 
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    });
};


exports.delete_customer = function(req,res){
          
     var id = req.params.id;
    
     req.getConnection(function (err, connection) {
        
        connection.query("DELETE FROM customer  WHERE id = ? ",[id], function(err, rows)
        {
            
             if(err)
                 console.log("Error deleting : %s ",err );
            
             res.redirect('/customers');
             
        });
        
     });
};


exports.verify = function(req, res){
    
    var id = req.params.id;
    
    req.getConnection(function (err, connection) {
        
        var data = {
            
            status   : 'Verified'
        
        };
        
        connection.query("UPDATE customer set ? WHERE id = ? ",[data,id], function(err, rows)
        {
  
          if (err)
              console.log("Error Updating : %s ",err );
         
          res.redirect('/customers');
          
        });
    
    });

};

/*Is it a verified customer?*/
exports.check = function(req,res, next){

    var name = req.body.name;
    console.log(req.body);
    console.log(name);
    req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM customer WHERE name = ?',[name],function(err,rows)
        {
            if(err)
                console.log("Error Selecting : %s ",err );

			console.log(rows);
			if(rows[0] == null){	
		         console.log('No matching user found');
			    var data = {
            			name    : req.body.name,
            			address : req.body.address,
            			email   : req.body.email,
            			phone   : req.body.phone,
            			status  : 'To verify' 
        			};
        
        			var qry = connection.query("INSERT INTO customer set ? ",data, function(err, newrows)
        			{
 			         if (err)
              			console.log("Error inserting : %s ",err );
				    console.log('Customer will be verified');
					return res.send(data);	          
        			});

			}else{
			    return res.send(rows[0]);	
			}
         });
         console.log(query.sql);
    });     
};


