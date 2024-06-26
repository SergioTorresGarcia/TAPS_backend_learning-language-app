import { Request, Response } from "express"
import { Word } from "../database/models/Word";
import { UserWord } from "../database/models/UserWord";


export const getWords = async (req: Request, res: Response) => {
    try {
        const words = await Word.find();

        res.status(200).json({
            success: true,
            message: "Words retrieved successfuly",
            data: words
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Words couldn't be retrieved",
            error: error
        })
    }
}

export const getOneWord = async (req: Request, res: Response) => {
    try {
        const word = await Word.findOne({
            where: {
                id: 1,
            }
        });

        if (!word) {
            return res.status(404).json({
                success: false,
                message: "No word found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Word retrieved successfully",
            data: word
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Word couldn't be retrieved",
            error: error
        })
    }
}

export const getWordById = async (req: Request, res: Response) => {
    try {
        const wordId = parseInt(req.params.id);
        const word = await Word.findOne({
            where: {
                id: wordId,
            }
        });

        if (!word) {
            return res.status(404).json({
                success: false,
                message: "No word found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Word retrieved successfully",
            data: word
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Word couldn't be retrieved",
            error: error
        })
    }
}

export const getWordsFromLevel = async (req: Request, res: Response) => {
    try {
        const levelId = req.params.level_id;
        const wordsFromLevel = await Word.find({
            where: {
                levelId: parseInt(levelId)
            }
        }); // Fetch words for the specified level_id

        res.status(200).json({
            success: true,
            message: "Words retrieved successfully",
            data: wordsFromLevel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Words couldn't be retrieved",
            error: error
        });
    }
}

export const getWordsFromLevelToDivert = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId;
        // All words
        const words = await Word.find();
        // Find user's words
        const learntWords = await UserWord.find({ where: { userId }, relations: ["word"] });
        const learntConcepts = learntWords?.map(item => item.word.EN);
        const currentWord = words.find(word => !learntConcepts.includes(word.EN));
        console.log(learntConcepts);
        console.log(currentWord);

        const levelId = req.params.level_id;
        const wordsFromLevel = await Word.find({
            where: {
                levelId: parseInt(levelId)
            }
        }); // Fetch words for the specified level_id

        const wordsToDivert = wordsFromLevel.filter(word => word.id !== currentWord?.id);
        res.status(200).json({
            success: true,
            message: "Words retrieved successfully",
            data: wordsToDivert
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Words couldn't be retrieved",
            error: error
        });
    }
}


export const createNewWord = async (req: Request, res: Response) => {
    try {
        const { EN, JP, romanji, image, level_id } = req.body

        const newWord = await Word.create({
            EN: EN,
            JP: JP,
            romanji: romanji,
            image: image,
            level: { id: level_id }
        }).save()

        res.status(201).json({
            success: true,
            message: "New word created successfuly",
            data: newWord
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "New word cannot be created",
            error: error
        })
    }
}

export const updateWord = async (req: Request, res: Response) => {
    const { EN, JP, romanji, image, levelId } = req.body
    const wordId = parseInt(req.params.id);


    try {
        const word = await Word.findOne({ where: { id: wordId } });
        if (!word) {
            return res.status(404).json({
                success: false,
                message: 'Word not found'
            });
        }

        word.EN = EN;
        word.JP = JP;
        word.romanji = romanji;
        word.image = image;
        word.levelId = levelId;

        const updatedWord = await word.save();

        res.status(200).json({
            success: true,
            message: 'Word updated successfully',
            data: updatedWord
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Word was not updated",
            error: error
        })
    }
}

export const deleteWord = (req: Request, res: Response) => {
    try {
        const wordId = parseInt(req.params.id);


        if (!wordId) {
            return res.status(404).json({
                success: false,
                message: "Word not found"
            })
        }
        Word.delete(
            { id: wordId }
        )

        res.status(200).json({
            "success": true,
            "message": "Word deleted successfuly"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Word was not updated",
            error: error
        })
    }
}


//all the learnt words
export const getWordsLearnt = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId;

        // // All words
        // const words = await Word.find();
        // // Find user's words
        const learntWords = await UserWord.find({ where: { userId }, relations: ["word"] });
        const learntConcepts = learntWords?.map(item => item.word.EN);


        return res.status(200).json({
            success: true,
            message: "Learnt words retrieved successfully",
            data: learntWords
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve learnt words",
            error: error
        });
    }
}

// Gives the word at play at the moment (current word)
export const getWordToPlay = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId;

        // All words
        const words = await Word.find();
        // Find user's words
        const learntWords = await UserWord.find({ where: { userId }, relations: ["word"] });
        const learntConcepts = learntWords?.map(item => item.word.EN);
        console.log(2, learntWords);
        console.log(3, learntConcepts);

        const currentWord = words.find(word => !learntConcepts.includes(word.EN));
        if (!learntWords) {
            return words[0]
        }
        console.log(4, currentWord);

        return res.status(200).json({
            success: true,
            message: "Current word to play retrieved successfully",
            data: currentWord
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve word",
            error: error
        });
    }
}