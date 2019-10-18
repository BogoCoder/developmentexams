chess = new chessboard("white");
boxd1 = new box("D", 1, chess);
boxd4 = new box("D", 4, chess);
boxe5 = new box("E", 5, chess);
rookd1 = new piece(boxd1, "white", "rook");
pawnd4 = new piece(boxd4, "white", "pawn");
pawne5 = new piece(boxe5, "black", "pawn");