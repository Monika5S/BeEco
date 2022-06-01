function process_image(){
    ans=localStorage.getItem('prediction')
    if(ans==null)
    {
        $('#d2 h3').text('Click Again');
        return
    }
    ans=JSON.parse(ans)
   
    var pred_perc=0
    var tag_name=''
    $.each(ans.predictions,function(key,value)
    {
        new_perc=JSON.stringify(ans['predictions'][key]['probability'])*100
        new_tag=JSON.stringify(ans['predictions'][key]['tagName'])
        if(pred_perc<new_perc)
        {
            pred_perc=new_perc
            tag_name=new_tag
        }
    })

    print_tag(pred_perc,tag_name)
}


function print_tag(perc,tag)
{
    // alert(perc)
    if(perc>90){
        $('#d2 h3').text(tag);
    }
    else{
        $('#d2 h3').text('"not a recyclable object"');
    }
    localStorage.clear();
}
