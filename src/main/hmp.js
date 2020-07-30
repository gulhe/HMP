
class HMP{

    constructor(biFunction){
        this.nestedResolves = [];
        this.state="pending";
        this.value=undefined;
        biFunction(this.resolve.bind(this), this.reject.bind(this))
    }
    resolve(value){
        this.value= value;
        this.state= `resolved`;
        this.nestedResolves.forEach(f=>f(value));
    }
    then(funk){
        if(this.state===`resolved`){
            return new HMP(
                resolve => resolve(funk(this.value))
            );
        }
        return new HMP(
            (resolve,reject)=>{
                this.nestedResolves.push(x=>resolve(funk(x)));
            }
        );
    }
    reject(caught){
        this.caught=caught;
    }
    catch(funk){
        funk(this.caught);
    }

}

function breaksOnOdds(i){
    if(i%2===0){
        return i;
    }
    throw `i(${i}) is not even ...`
}

let tryToBreakOnOddsOf2ThatWillSucceed = (resolve, reject)=>{
    try{
        resolve(breaksOnOdds(2));
    }catch(e){
        reject(e);
    }
};
let tryToBreakOnOddsOf3ThatWillSucceed = (resolve, reject)=>{
    try{
        resolve(breaksOnOdds(3));
    }catch(e){
        reject(e);
    }
};


new HMP(tryToBreakOnOddsOf2ThatWillSucceed).then(console.log);
new HMP(tryToBreakOnOddsOf3ThatWillSucceed).catch(console.log);
const myHache= new HMP(ok=>{
        setTimeout(()=>{
            ok(12)
        },1500)
    }
);
const yourHache= myHache
    .then(
        x=>(
            console.log("timedOut",x),
            new HMP(ok=>
                setTimeout(()=>{
                    ok(12)
                },1500)
            )
        )
    );
console.log("before resolution :",{myHache,yourHache});
yourHache
    .then(x=>console.log("and more",x))
    .then(_=> console.log("after yourHache is resolved :",{myHache,yourHache}));