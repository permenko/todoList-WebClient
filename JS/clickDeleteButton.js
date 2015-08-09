/**
 * Created by yury on 8/8/15.
 */
$("li").click(function() {
    var $li = $(this);
    $($li.index()).add($li).remove();
});