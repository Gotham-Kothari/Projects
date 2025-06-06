function lerp(A,B,t){
    return A+(B-A)*t;
}

function getIntersection(A,B,C,D){
    /*
    P = A + t(B - A)
    Q = C + u(D - C)
    
    P = Q
    
    Hence we obtain t and u
    */
    //AB = line 1
    //CD = line 2
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){ //checking if t and u both belong to [0, 1]
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }
    return null;
}

//Checking intersection between poly1, poly2
function polysIntersect(poly1, poly2){
    for(let i=0;i<poly1.length;i++){ // iterating across all points in car 1 (poly 1)
        for(let j=0;j<poly2.length;j++){ //iterating across all points in car 2 (poly 2)
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
}

function getRGBA(value) {
    const alpha = Math.abs(value);
    //Yellow = +ve, Blue = -ve
    const R = value < 0? 0: 255; //red
    const G = R; //green (since red + green = yellow)
    const B = value > 0? 0: 255 //blue
    return "rgba("+R+"," +G+ "," +B+ ","+alpha+")";
}
