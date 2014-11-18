
fg = {"black" => "color: #000000;",
  "red" => "color: #bb0000;",
  "green" => "color: #00bb00;",
  "yellow" => "color: #bbbb00;",
  "blue" => "color: #0000bb;",
  "magenta" => "color: #bb00bb;",
  "cyan" => "color: #00bbbb;",
  "white" => "color: #bbbbbb;"}

fg_b = {"black" => "color: #555555; font-weight:bold; ",
  "red" => "color: #ff5555; font-weight:bold; ",
  "green" => "color: #55ff55; font-weight:bold; ",
  "yellow" => "color: #ffff55; font-weight:bold; ",
  "blue" => "color: #5555ff; font-weight:bold; ",
  "magenta" => "color: #ff55ff; font-weight:bold; ",
  "cyan" => "color: #55ffff; font-weight:bold; ",
  "white" => "color: #ffffff; font-weight:bold; "}

bg = {"black_bg" => "background-color: #000000;",
  "red_bg" => "background-color: #bb0000;",
  "green_bg" => "background-color: #00bb00;",
  "yellow_bg" => "background-color: #bbbb00;",
  "blue_bg" => "background-color: #0000bb;",
  "magenta_bg" => "background-color: #bb00bb;",
  "cyan_bg" => "background-color: #00bbbb;",
  "white_bg" => "background-color: #bbbbbb;"}

bg_b = {"black_bg_b" => "background-color: #000000; ",
  "red_bg_b" => "background-color: #ff5555; ",
  "green_bg_b" => "background-color: #55ff55; ",
  "yellow_bg_b" => "background-color: #ffff55; ",
  "blue_bg_b" => "background-color: #5555ff; ",
  "magenta_bg_b" => "background-color: #ff55ff; ",
  "cyan_bg_b" => "background-color: #55ffff; ",
  "white_bg_b" => "background-color: #ffffff; "}

fg.each_pair { |k,v|
  bg.each_pair { |k2,v2|
    puts ".tnc_#{k}_#{k2} { #{v} #{v2} }"
  }
}

fg_b.each_pair { |k,v|
  bg_b.each_pair { |k2,v2|
    puts ".tnc_#{k}_#{k2} { #{v} #{v2} }"
  }
}

