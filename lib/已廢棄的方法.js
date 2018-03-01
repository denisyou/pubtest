// Simulation過濾
function disFilterInc(n) {

	/*
	data.link.filter(function(d) { return (d.disLevel >= n && d.disLevel < n + 1) }).forEach(function(d){
		if (d3.select('#link'+d.linkID).style('visibility') == 'hidden') {
		    d3.select('#node'+d.source.index).classed('.link'+d.linkID, true);
		    d3.select('#node'+d.target.index).classed('.link'+d.linkID, true);

		    d.source.num++;
		    d.target.num++;
		       		
		    if ( d.source.num > 0 && d3.select('#node'+d.source.index).style('visibility') == 'hidden' )
		        d3.select('#node'+d.source.index).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1).select('text').attr('filter', 'url(#solid)');
		    if ( d.target.num > 0 && d3.select('#node'+d.target.index).style('visibility') == 'hidden' )
		       	d3.select('#node'+d.target.index).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1).select('text').attr('filter', 'url(#solid)');
		       			//console.log(d);
		       			d3.select('#link'+d.linkID).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1);
		}
    });*/
    
    let buflink = fdata.link.filter(function(d) { return (d.disLevel >= n && d.disLevel < n + 1);  }); //return (d.disLevel >= n && d.disLevel < n + 1); 
   
    buflink.forEach(function(d) {
    	
		    d3.select('#node'+d.source.index).classed('.link'+d.linkID, true);
		    d3.select('#node'+d.target.index).classed('.link'+d.linkID, true);

		    d.source.num++;
		    d.target.num++;
		       		
		    //if ( d.source.num > 0 && d3.select('#node'+d.source.index).style('visibility') == 'hidden' )
		        //d3.select('#node'+d.source.index).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1).select('text').attr('filter', 'url(#solid)');
		    //if ( d.target.num > 0 && d3.select('#node'+d.target.index).style('visibility') == 'hidden' )
		       	//d3.select('#node'+d.target.index).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1).select('text').attr('filter', 'url(#solid)');
		       			//console.log(d);
		    //d3.select('#link'+d.linkID).style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1);
		
    });

   	data.name = data.name.concat(fdata.name.filter(function(d) { return d.num > 0; }));
   	fdata.name = fdata.name.filter(function(d) { return !(d.num > 0); });
    data.link = data.link.concat(buflink);
    fdata.link = fdata.link.filter(function(d) { return !(d.disLevel >= n && d.disLevel < n + 1); });
    console.log(buflink);
    console.log(fdata.name);

    // 修正
    data.link.forEach(function(d) {
    	if (data.name.some(function(f) { return f.index == d.source.link; }) == false) {
    		data.name.concat(fdata.name.find(function(f) { return f.index == d.source.index; }));
    		fdata.name = fdata.name.filter(function(f) { return !(f.index == d.source.index); });

    	}
    	if (data.name.some(function(f) { return f.index == d.target.link; }) == false) {
    		data.name.concat(fdata.name.find(function(f) { return f.index == d.target.index; }));
    		fdata.name = fdata.name.filter(function(f) { return !(f.index == d.target.index); });
    	
    	}
    });
    forceRefresh();

}
     
function freqFilterInc(n) {
	/*
    data.name.filter(function(d) { return (d.freqLevel >= n && d.freqLevel < n + 1) }).forEach(function(d){
        let bufnode = d3.select('#node'+d.index);
            if (bufnode.style('visibility') == 'hidden'){
              	d_reveal(bufnode);
	            data.link.filter(function(dd) { return (dd.source.index == d.index || dd.target.index == d.index ) } ).forEach(function(dd) {
		            if (d3.select('#node'+dd.source.index).style('visibility') == 'visible' && d3.select('#node'+dd.target.index).style('visibility') == 'visible') {
		                d_reveal(d3.select('#link'+dd.linkID));
		            }
	            });
            }
           
    });
    */
    data.name = data.name.concat(fdata.name.filter(function(d) { return (d.freqLevel >= n && d.freqLevel < n + 1) }));
    fdata.name = fdata.name.filter(function(d) { return !(d.freqLevel >= n && d.freqLevel < n + 1 ) });

    let bufName = data.name.filter(function(d) { return (d.freqLevel >= n && d.freqLevel < n + 1) });
    let rlinks = [];
    bufName.forEach(function(d) {
    	d.links.forEach(function(dd) {

    		fdata.link.filter(function(s){ return s.linkID == dd }).forEach(function(s) {
    			if(data.name.some(function(f) { return f.index ==  s.source.index }) &&
    				data.name.some(function(f) { return f.index ==  s.target.index}) && 
    				rlinks.some(function(f) { return f.linkID == s.linkID }) == false)
    					rlinks.push(s);
    		});
    	});
    });
    data.link = data.link.concat(rlinks);
    rlinks.forEach(function(d) {
    	fdata.link = fdata.link.filter(function(dd) { return !(dd.linkID == d.linkID); });
    });
    console.log(rlinks);


    forceRefresh();
}


function freqFilterDec(n) {
	/*
    data.name.filter(function(d) { return (d.freqLevel > n && d.freqLevel <= n + 1) }).forEach(function(d){

        d.links.forEach(function(dd) {
            d_vanish(d3.select('#link'+dd));
        });
        let bufnode = d3.select('#node'+d.index);
        d_vanish(bufnode);
    });
    */
    let bufName = data.name.filter(function(d) { return (d.freqLevel > n && d.freqLevel <= n + 1) });
    let rlinks = [];
    fdata.name = fdata.name.concat( bufName );
    data.name = data.name.filter(function(d) { return !(d.freqLevel > n && d.freqLevel <= n + 1) });

    bufName.forEach(function(d) {
    	d.links.forEach(function(dd) {
    		data.link.filter(function(s){ return s.linkID == dd }).forEach(function(s) {
    			rlinks.push(s);
    		});
    		
    	});
    	
    });

    fdata.link = fdata.link.concat(rlinks);
    rlinks.forEach(function(d) {
    	data.link = data.link.filter(function(dd) { return !(dd.linkID == d.linkID) });
    });






    forceRefresh();
    /*
    fdata.link = data.link.filter(function(d) { return d.linkID == 'link'+dd.id });

   	fdata.name = data.name.filter(function(d) { return (d.freqLevel > n && d.freqLevel <= n + 1) });
   	data.name = data.name.filter(function(d) { return !(d.freqLevel > n && d.freqLevel <= n + 1) })
   	fdata.name.forEach(function(d) {
   		d.links.forEach(function(dd) {
   			data.link.filter(function(f) { return 'link'+f.linkID == dd }).forEach(function(s) {
   				
   			});
   		});
   	});*/

}

function disFilterDec(n) {

	let buflink = data.link.filter(function(d) { return (d.disLevel > n && d.disLevel <= n + 1 ) });
		buflink.forEach(function(d){
	       	d3.select('#node'+d.source.index).classed('.link'+d.linkID, false);
	       	d3.select('#node'+d.target.index).classed('.link'+d.linkID, false);
	       	console.log(d.linkID);

	       	d.source.num--;
	       	d.target.num--;
	       			
	      // 	if ( d.source.num <= 0 ) {		
	       		//d3.select('#node'+d.source.index).attr('opacity', 1).transition().attr('opacity', 0).transition().style('visibility', 'hidden').select('text').attr('filter', 'none');
	      // 	}
			//if ( d.target.num <= 0 )
				//d3.select('#node'+d.target.index).attr('opacity', 1).transition().attr('opacity', 0).transition().style('visibility', 'hidden').select('text').attr('filter', 'none');		
	       //	d3.select('#link'+d.linkID).attr('opacity', 1).transition().attr('opacity', 0).transition().style('visibility', 'hidden');
   		});

	fdata.name = fdata.name.concat(data.name.filter(function(d) { return d.num <= 0 }));
   	data.name = data.name.filter(function(d) { return (d.num > 0);});
   	console.log(fdata.name);
	
	fdata.link = fdata.link.concat(buflink);
 	data.link = data.link.filter(function(d) { return !(d.disLevel > n && d.disLevel <= n + 1  ) });
 	console.log(fdata.link);
 	forceRefresh();

}

// 廢棄
disZoomPlus.on('click', function(){ if( filterLevel < 10 ) filterLevel++; disZoomText.text(filterLevel); disFilterInc(filterLevel); if ( filterLevel == 10 ) disZoomText.attr('transform', 'translate(-2, 62.5)')});
        disZoomMinus.on('click', function(){ if( filterLevel > 0 ) filterLevel--; disZoomText.text(filterLevel); disFilterDec(filterLevel); disZoomText.attr('transform', 'translate(6, 62.5)'); } );
        disZoomPlus.on('mouseover', function(){ d3.select(this).transition().attr('transform', 'translate(-4, -10) scale(1.3)') })
                    .on('mouseout', function(){ d3.select(this).transition().attr('transform', '') });
        disZoomMinus.on('mouseover', function(){ d3.select(this).transition().attr('transform', 'translate(-4, 75) scale(1.3)') })
                    .on('mouseout', function(){ d3.select(this).transition().attr('transform', 'translate(0, 75)') });