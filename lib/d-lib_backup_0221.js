// 過濾重複的關係R
function sfile_distinct( sfile ) {
      let res = [];
      sfile.forEach(function(d) {
        if ( res.some(function(dd) { return dd.k1 == d.k2 && dd.k2 == d.k1 && d.score == dd.score; }) == false ) {
          res.push(d);
        }
      });
      return res;
}

// 將json格式導入ForceSimulation
 function jsonToForceSim( jsonData ) {
      let data = {'name':[], 'link':[]};
      let buf = [];
      jsonData.forEach(function(d, i) {
        if ( data.name.some(function(dd) { return dd.id == d.k1 }) == false ) {
          data.name.push( { id: d.k1, num:1, links: [`${i}`] } );
          buf.push(d.k1);
        } else {
          let bufName = data.name.find(function(item, index, array) { return item.id == d.k1; });
          bufName.num++;
          bufName.links.push(`${i}`);
        }

        if ( data.name.some(function(dd) { return dd.id == d.k2 }) == false ) {
          data.name.push({ id: d.k2, num: 1, links:[`${i}`] });
          buf.push(d.k2);
        } else {
          let bufName = data.name.find(function(item, index, array) { return item.id == d.k2 });
          bufName.num++;
          bufName.links.push(`${i}`);
        }
        data.link.push( { source: buf.indexOf(d.k1), target: buf.indexOf(d.k2), rel: d.score, linkID: i } );
      }); 
      return data;
   }
// ObjArray 系列
// 自訂義臨界值
function d_max( objArray, prop ) {
	let max;
	objArray.forEach(function(d, i) {
		if ( i == 0 ) {
			max = d[prop];
		} 
		if ( d[prop] > max )
			max = d[prop];
	});
	return max;
}

function d_min( objArray, prop ) {
	let min;
	objArray.forEach(function(d, i) {
		if ( i == 0 )
			min = d[prop];
		if ( min > d[prop] )
			min = d[prop];
	});
	return min;
}

function d_dupli( objArray, p1, p2 ) {
	objArray.forEach(function(d) {
		d[p2] = d[p1];
	});
}

let zoomProps = {
  x: 0,
  y: 0,
  k: 0.32
}

// zoom的縮放主體
let zoom = d3.zoom()
	.scaleExtent([0.2, 1.5])
	.on("zoom", zoomed);
function zoomed() {
	/*
  let buf;
  buf = d3.event.transform;
  if (zoomProps.x == 0 && zoomProps.y == 0 ) {
    buf.x = 128 / zoomProps.k ;
    buf.y = 80 / zoomProps.k ;
    buf.k = zoomProps.k;
    zoomProps.x = buf.x;
    zoomProps.y = buf.y;
    //zoomProps.k = buf.k;
  } else {
    zoomProps.x = buf.x;
    zoomProps.y = buf.y;
    //zoomProps.k = buf.k;
    buf.k = zoomProps.k;
  }*/
  //svgZoomed.transition().duration(10).attr('transform', buf );
  console.log(d3.event.transform);
	console.log(d3.zoomTransform(svgZoomed.node()).k+' '+d3.event.transform.k);
  if ( zoomProps.x == 0 && zoomProps.y == 0 ) {
    let bb = svgZoomed.node().getBBox();
    zoomProps.x = bb.x;
    zoomProps.y = bb.y;
    svgZoomed.attr("transform", 'translate(' + zoomProps.x + ',' + zoomProps.y + ') scale(' + d3.zoomTransform(svgZoomed.node()).k + ')');
  } else {
    svgZoomed.attr("transform", 'translate(' + d3.event.transform.x + ',' + d3.event.transform.y + ') scale(' + d3.zoomTransform(svgZoomed.node()).k + ')');//d3.event.transform.k//d3.zoomTransform(svgZoomed.node()).k
  }
}

// node的拖曳(drag)配套
let drag = d3.drag()
	.on("start", dragstarted)
	.on("drag",dragged)
	.on("end", dragended);

 function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
 	   d.fx = d.x;
 	   d.fy = d.y;
}
        
function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}
     
function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
	    d.fx = null;
    	d.fy = null;
}
// 自製動畫快捷
function d_vanish(s) {
	s.attr('opacity', 1).transition().attr('opacity', 0).transition().style('visibility', 'hidden');
}

function d_reveal(s) {
    s.style('visibility', 'visible').attr('opacity', 0).transition().attr('opacity', 1);
}


// 自製元件快捷
function svgInit( slt, width, height ) {
	let svg = slt.append('svg')
				.attr('width', width+'px')
				.attr('height', height+'px');
	return svg;

}

// 正在測試中的Zoomed調整法

 //.on('click', function() {

            	//svgZoomed.transition().attr('transform', `translate(${-d3.select(this).attr('cx')+800}, ${-d3.select(this).attr('cy')+400}) `);
            	//zoom.translateTo(svgZoomed, d3.select(this).attr('cx') ,d3.select(this).attr('cy'));
              //svgZoomed.transition().duration(200).call(zoom.transform, zoomtest);

            //})
            
           // function zoomtest() {
              //return d3.zoomIdentity.translate(0, 0).scale(1);
           // }
            /*
            .on('mouseover' , function(d) {
            	d3.selectAll('.l'+d.index).transition().duration(100).attr('opacity', 1);
            }).on('mouseout', function(d) {
            	d3.selectAll('.l'+d.index).transition().duration(100).attr('opacity', 0);
            })
            */
/* 初始參考
        function zoom_actions(){
		    d3.select(this).attr("transform", d3.event.transform)
		}   
    */
// 時間控制
let timer = function( ms ) {
	this.t1 = new Date().getTime();
	this.cd = ms;
}

timer.prototype.restart = function() {
	this.t1 = new Date().getTime();
}

timer.prototype.available = function() {
	if ( (new Date().getTime()) - this.t1 > this.cd )
				return true;
			else 
				return false;
}


function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}


function forceRefresh() {


		 link.remove();
         node.remove();
         d3.selectAll('.forclear').remove();
          

          link = svgZoomed.append("g")
            .classed('forclear', true)
            .selectAll("line")
            .data(data.link)
            .enter()
            .append("g");
      
    link.append('line')
            .attr('id', function(d){ return `link${d.linkID}` })
            .attr('stroke', 'blue') 
            .attr('stroke-width', forceProps.linkWidth+'px');
           
      
    link.append('text').attr('font-size', 32+'px').text(function(d){return d.rel;}).attr('opacity', 0).on('mouseover', function() {
      d3.select(this).transition().attr('opacity', 1);
    }).on('mouseout', function() {
      d3.select(this).transition().attr('opacity', 0);
    });
         
    node = svgZoomed.selectAll("circle")
            .data(data.name)
            .enter().append("g")
            .classed('forclear', true)
            .attr('id', function(d, i) { return `node${i}`; })
            .attr('class', function(d){ 
              let s = '';
              d.links.forEach(function(dd, ii) {
                if ( ii == 0 )
                  s = s + 'link' + dd;
                else
                  s = s + ' link' + dd;
              }) 
              return s;

            })
            .on('mouseover', function(d) { 
              d3.select(this).select('circle').transition().attr('r', ((d.freq * forceProps.collideMag + forceProps.collideBase) / (zoomProps.k + 1))*1.4);
              d3.select(this).select('text').transition().attr('transform', `translate(20,0)`);
            })
            .on('mouseout', function(d) { 
              d3.select(this).select('circle').transition().attr('r', ((d.freq * forceProps.collideMag + forceProps.collideBase) / (zoomProps.k + 1))); 
              d3.select(this).select('text').transition().attr('transform', '');
            });

    // 節點大小調節
   /* while( data.name.some(function(f){ return ((f.freq * forceProps.collideMag + forceProps.collideBase) * zoomProps.k) > ( 27 ) }) ) {
      if ( forceProps.collideMag > 0.1 ) {
        forceProps.collideMag = forceProps.collideMag - 0.1;
      }
      else {
        break;
      }
      console.log('修正');
      
    }*/



    node.append('circle').attr("r", function(d){ return ((d.freq * forceProps.collideMag + forceProps.collideBase) / (zoomProps.k + 1)) })
        .attr('fill', function(d) { return cScale(d.freq); })
        .attr('stroke', '#BEBEBE').attr('stroke-width', '4px');

  

    drag(node);
        
    //if ( forceProps.fontSize * forceProps.zoomLevel > 20 ) {
      
      forceProps.fontSize = 20 / zoomProps.k;
    //}
    nodeLabel = node.append("text")
                  .attr('font-size', forceProps.fontSize+'px').attr('font-weight', 'bold').attr('filter', 'url(#solid)')
                  .text(function(d) { return d.id });


   simulation.nodes(data.name).on("tick", ticked);
    simulation.force("link").links(data.link);
    simulation.alpha(0.5).restart();

    if ( forceProps.freqFilter <= 6 ) {
      svgZoomed.transition().call( zoom.scaleTo, 0.7 );
    } else {
      svgZoomed.transition().call( zoom.scaleTo, 0.32 );
    }

    d_reveal(node);
    d_reveal(link);
    d_reveal(nodeLabel);

}

function forceFilter( dist, freq ) {
	// >dist deleted
  if ( forceProps.freqFilter <= 6 ) {
      svgZoomed.transition().call( zoom.scaleTo, 0.7 );
      zoomProps.k = 0.7;
  } else {
      svgZoomed.transition().call( zoom.scaleTo, 0.32 );
      zoomProps.k = 0.32;
  }
	//fdata.link = fdata.link.concat(data.link.filter(function(f){ return f.disLevel > dist }));
	//data.link = data.link.filter(function(f){ return !(f.disLevel > dist); });
	data.link = bkdata.link.filter(function(f){ return f.disLevel <= dist });
	data.name = bkdata.name.filter(function(f){ return f.freqLevel <= freq });


	let rlinks = [];
	data.link.forEach(function(d) {
		if( data.name.some(function(f){ return d.source.id == f.id }) == false ||
			data.name.some(function(f){ return d.target.id == f.id }) == false )
				rlinks.push(d.linkID);
	});

	rlinks.forEach(function(d) {
		data.link = data.link.filter(function(f) { return f.linkID != d });
	});

	rnodes = [];
	data.name.forEach(function(d) {
		let isfind;
		isfind = false;
		data.link.forEach(function(dd) {
			if( d.links.some(function(f){ return f == dd.linkID }) == true ) {
				isfind = true;
			}
		});
		if ( !isfind ) {
			rnodes.push(d.id);
		}
			
	});
	rnodes.forEach(function(d) {
		data.name = data.name.filter(function(f) { return f.id != d });
	});






	console.log(bkdata);

	console.log(data);

	forceRefresh();
		
/*
	let rlinks = [];
	bkdata.link.forEach(function(d) {
		if( bkdata.name.some(function(f){ return d.source.index == f.index }) == false ||
			bkdata.name.some(function(f){ return d.target.index == f.index }) == false )
			rlinks.push()

	});*/
}

let testPanel = function( slt, prop, x, y ) {
  let ptr = this;
  this.tp = slt.append('g').attr('transform', 'translate('+x+', '+y+')');
  this.tpbackGround = this.tp.append('rect').attr('fill', 'balck').attr('opacity', 0.7);
  this.text = this.tp.append('text').text(prop).attr('font-size', 24+'px').attr('fill', 'white').attr('transform', 'translate(5, 24)');
  this.bbox = this.text.node().getBBox();
  this.tpbackGround.attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
  
  this.option = prop;
  this.val = 0;
  this.linkObj = 0;
  this.linkProp = 0;
  this.linkdefault = 0;
  
  this.sensor = this.tp.append('rect').attr('opacity', 0).attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
  this.mask = new maskLayer();
  this.finput = new divInput(x, y, this.bbox.width, this.bbox.height);

  this.finput.div.on('keypress' , function() { if( d3.event.keyCode == 13 ) ptr.inActive() });
  this.mask.impl.on('click', function() { ptr.inActive() });
  this.sensor.on('click', function() { ptr.active() });

}

testPanel.prototype = {
  constructor:testPanel,
  active:function() {
    //if ( this.val == 0 ) {
      this.finput.input.property('value', '');
    //} else {
    //  this.finput.input.property('value', this.val);
    //}
          this.mask.reveal();
          this.finput.div.style('visibility', 'visible').transition().style('opacity', 1); 
          this.finput.input.node().focus();
  },
  inActive:function() {
    this.mask.vanish();
    this.finput.div.style('opacity', 1).transition().style('opacity', 0).transition().style('visibility', 'hidden');
    this.val = this.finput.input.property('value');

    if ( this.val != '' )
       this.text.text(this.option+': '+parseFloat(this.val));
    else
       this.text.text(this.option+': '+this.linkdefault);//this.text.text(this.option);

    this.bbox = this.text.node().getBBox();
    this.tpbackGround.attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
    this.sensor.attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
    this.finput.resize(this.bbox.width, this.bbox.height);
    if ( this.linkObj != 0 ) {
      if ( this.val == '' ) {
        this.linkObj[ this.linkProp ] = this.linkdefault;
      } else {
        this.linkObj[ this.linkProp ] = parseFloat(this.val);
      }
      console.log(forceProps);
      forceReset(simulation);
      svgZoomed.transition().duration(200).call( zoom.scaleTo, zoomProps.k );
    }
  },
  linkage:function( obj, prop, def ) {
    this.linkObj = obj;
    this.linkProp = prop;
    this.linkdefault = def;
    if ( this.linkObj[ this.linkProp ] != 0 ) {
      this.val = this.linkObj[ this.linkProp ];
      this.text.text(this.option+': '+this.val);
      this.bbox = this.text.node().getBBox();
      this.tpbackGround.attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
      this.sensor.attr('width', this.bbox.width+8+'px').attr('height', this.bbox.height+6+'px');
      this.finput.resize(this.bbox.width, this.bbox.height);
    }
  }

}


let maskLayer = function() {
  this.opacity = 0.3;
  this.impl =  d3.select('body').append('div').style('position', 'fixed').style('top', 0).style('left', 0)
                .style('width', '100%').style('height', '100%').style('background', '#000')
                .style('opacity', 0).style('visibility', 'hidden')
                .on('click', function(){ d3.select(this).style('opacity', this.opacity).transition().style('opacity', 0).transition().style('visibility', 'hidden'); });
  
};

maskLayer.prototype = {
  constructor: maskLayer, 
  hide:function() {
    this.impl.style('opacity', 0).style('visibility', 'hidden');
  },
  show:function() {
    this.impl.style('visibility', 'visible').style('opacity', this.opacity);
  },
  vanish:function() {
    this.impl.style('opacity', this.opacity).transition().style('opacity', 0).transition().style('visibility', 'hidden');
  },
  reveal:function() {
    this.impl.style('visibility', 'visible').style('opacity', 0).transition().style('opacity', this.opacity);
  }
};    

let divInput = function( x, y, width, height) {
  this.div = d3.select('body').append('div').style('position', 'fixed').style('top', y+8+'px').style('left', x+6+'px').style('visibility', 'hidden').style('opacity', 0)
                .on('keypress',function(){ if( d3.event.keyCode == 13 ) {d3.select(this).transition().style('opacity', 0).transition().style('visibility', 'hidden'); }});
  this.input = this.div.append('input').attr('type', 'text').style('font-size', 24+'px').style('width', width+6+'px').style('height', height+0+'px').style('background-color', 'rgba(255,255,255, 0.85)');
}

divInput.prototype = {
  constructor:divInput,
  resize:function(w, h) {
    this.input.style('width', w+6+'px').style('height', h+0+'px');
  }
}

function forceReset( f ) {

  forceProps.linkDist = 30 / zoomProps.k;
  f.force("link", d3.forceLink().id(function(d) { return d.index }).distance(function(d){return forceProps.linkDist * tScale(d.rel);}).strength(forceProps.linkStr))
        .force("center", d3.forceCenter().x(forceProps.winWidth * .5).y(forceProps.winHeight * .5))
        .force("forceX", d3.forceX().strength(forceProps.forceX).x(forceProps.winWidth * .5))
        .force("forceY", d3.forceY().strength(forceProps.forceY).y(forceProps.winHeight * .5))
        .force("collide",d3.forceCollide().iterations(5).radius(function(d){ return ((d.freq * forceProps.collideMag + forceProps.collideBase) / (zoomProps.k + 1)) }) )//d.freq * forceProps.collideMag + forceProps.collideBase
        .force("charge", d3.forceManyBody().strength(forceProps.chargeStr));
        forceRefresh();

}


let controlPanel = function( slt, x, y, type ) {//100, 100
  let ptr = this;
  this.type = type;

  this.cd = new timer(500);
  this.cover = slt.append('path').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '2.5px').attr('d', 'M5 0, L25 0 Q30 0, 30 5, L30 100 Q30 105, 25 105, L5 105 Q0 105, 0 100, L0 5 Q0 0,5 0')
                  .attr('transform', 'translate('+x+', '+y+')').attr('visibility', 'hidden');
  this.background = this.cover.append('rect').attr('width', '30px').attr('height', '105px').attr('opacity', 0);
  this.panel = slt.append('g').attr('visibility', 'visible')//.attr('visibility', 'hidden')
                .attr('transform', 'translate('+x+', '+y+')');
  this.plus = this.panel.append('g');
  this.minus = this.panel.append('g');

  this.plus.append('path').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '2.5px')
            .attr('d', 'M5 0, L25 0 Q30 0, 30 5, L30 25 Q30 30, 25 30, L5 30 Q0 30, 0 25, L0 5 Q0 0, 5 0');
  this.plus.append('path').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '2.75px')
            .attr('d', 'M15 15 Q-5 15, 15 15 Q35 15, 15 15 Q15 -5, 15 15 Q15 35, 15 15');
  this.minus.append('path').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '2.5px')
            .attr('d', 'M5 0, L25 0 Q30 0, 30 5, L30 25 Q30 30, 25 30, L5 30 Q0 30, 0 25, L0 5 Q0 0, 5 0');
  this.minus.append('path').attr('fill', 'none').attr('stroke', 'black').attr('stroke-width', '2.75px')
            .attr('d', 'M15 15 Q-5 15, 15 15 Q35 15, 15 15');
  this.minus.attr('transform', 'translate(0, 75)');
  
  this.text = this.panel.append('text').attr('font-size', '32px').text(forceProps.distFilter).attr('transform', 'translate(-2, 62.5)');
  if ( type == 1 ) this.text.text(forceProps.distFilter);
  this.cover.on('mousemove', function() { ptr.openCover( x, y ); });
  this.sensor = this.panel.append('rect').attr('fill', 'black').attr('width', '30px').attr('height', '105px').attr('opacity', 0);
  this.sensor.on('mousemove', function() { let m = d3.mouse(this); ptr.panelMove(m); })
            .on('mouseout', function() { ptr.panelOut(); })
            .on('click', function() { let m = d3.mouse(this); ptr.panelClick(m); });
}

controlPanel.prototype = {
  constructor: controlPanel,
  openCover:function( x, y ) {
    if ( !this.cd.available() ) return false;
    this.cd.restart();
    this.cover.attr('transform', 'translate('+x+', '+y+')').transition().delay(100).attr('transform', 'translate('+x+', '+(y-50)+')').attr('opacity', 1).transition().duration(250).attr('opacity', 0).transition().attr('visibility', 'hidden');
    this.panel.attr('visibility', 'visible').attr('opacity', 0).transition().delay(350).attr('opacity',1);
  },
  panelMove:function( m ) { 
    if (m[0] <= 30 && m[1] <= 30) {
      this.plus.transition().attr('transform', 'translate(-4, -10) scale(1.3)');

    } else if ( m[0] <= 30 && m[1] >=(105-30) && m[1] <= 105 ) {
      this.minus.transition().attr('transform', 'translate(-4, 75) scale(1.3)');
    } else {
      this.plus.transition().attr('transform', '');
      this.minus.transition().attr('transform', 'translate(0, 75)');
    } 
  },
  panelOut:function() {
     /*
    if ( !this.cd.available() ) return false;
    this.cd.restart();
    this.plus.transition().attr('transform', '');
    this.minus.transition().attr('transform', 'translate(0, 75)');
    this.cover.transition().delay(100).attr('transform', 'translate(100, 100) scale(1)').attr('visibility', 'visible').attr('opacity', 0).attr('opacity', 1);
    this.panel.attr('opacity', 1).transition().attr('opacity',0).transition().attr('visibility', 'hidden');
*/
    this.plus.transition().attr('transform', '');
    this.minus.transition().attr('transform', 'translate(0, 75)');
  },
  panelClick:function( m ) {
    if ( this.type == 0) {
      if (m[0] <= 30 && m[1] <= 30) {
        if( forceProps.distFilter < 10 ) {forceProps.distFilter++; this.text.text(forceProps.distFilter); forceFilter(forceProps.distFilter, forceProps.freqFilter);} if ( forceProps.distFilter == 10 ) this.text.attr('transform', 'translate(-2, 62.5)');
      } else if ( m[0] <= 30 && m[1] >=(105-30) && m[1] <= 105 ) {
        if( forceProps.distFilter > 0 ) {forceProps.distFilter--; this.text.text(forceProps.distFilter); forceFilter(forceProps.distFilter, forceProps.freqFilter);} this.text.attr('transform', 'translate(6, 62.5)');
      } else {} 
    } else {
      if (m[0] <= 30 && m[1] <= 30) {
        if( forceProps.freqFilter < 10 ) {forceProps.freqFilter++; this.text.text(forceProps.freqFilter); forceFilter(forceProps.distFilter, forceProps.freqFilter);} if ( forceProps.freqFilter == 10 ) this.text.attr('transform', 'translate(-2, 62.5)');
      } else if ( m[0] <= 30 && m[1] >=(105-30) && m[1] <= 105 ) {
        if( forceProps.freqFilter > 0 ) {forceProps.freqFilter--; this.text.text(forceProps.freqFilter); forceFilter(forceProps.distFilter, forceProps.freqFilter);} this.text.attr('transform', 'translate(6, 62.5)');
      } else {} 
    }
  },

}